const express = require ('express');

const db = require('./connection/db')
const bcrypt = require('bcrypt');
const session = require('express-session');
const flash = require('express-flash');
const upload = require('./middlewares/uploadFile');

const app = express()
const port = 3000

const isLogin = true;

const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December',];


let projects = [];

// TEST CONNECTION DB
//db.connect(function(err, _, done){
//  if (err) throw err;

//  console.log('Database Connection Success');
//});

app.set('view engine', 'hbs'); //setup template engine / view engine

app.use('/public', express.static(__dirname + '/public'));
app.use('/uploads', express.static(__dirname + '/uploads'));

app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    secret: 'gitar12345',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 2 },
  })
);

app.use(flash());


// Routing GET
app.get('/', (req, res) => {

  db.connect(function(err, client, done) {
    if (err) throw err;

    let query = '';
    if (req.session.isLogin){
        query = `SELECT tb_project.*, tb_users.id as user_id, tb_users.name as author_name
            FROM tb_project
            LEFT JOIN tb_users
            ON tb_project.author_id = tb_users.id
            WHERE tb_users.id = ${req.session.user.id};`
    }else{
        query = `SELECT tb_project.*, tb_users.id as user_id, tb_users.name as author_name
            FROM tb_project
            LEFT JOIN tb_users
            ON tb_project.author_id = tb_users.id;`
    }

    console.log(query);

  client.query(query, function (err, result){
    if (err) throw err;

  const projectsData = result.rows;

  const newProject = projectsData.map((project) => {
  project.isLogin = req.session.isLogin;
  project.duration = durationTime(project['start_date'],project['end_date']);
  project.name = project.name ? project.name : 'Anonymous';
  project.time = getFullTime(project['start_date']);
  project.image = project.image ? '/uploads/' + project.image : '/public/assets/my-project-img-detail.png'
    return project;
  });

  console.log(newProject);

  res.render('index', {isLogin: req.session.isLogin, user: req.session.user, projects: newProject});
  });

  done();
});
});


app.get('/add-project',(req, res) =>{
  if (!req.session.isLogin){
    req.flash('error', 'Please Login First!')
    res.redirect('/')
}
  res.render('add-project',{isLogin: req.session.isLogin, user: req.session.user});

});

app.get('/contact-me', (req, res) => {
    res.render('contact-me',{isLogin: req.session.isLogin, user: req.session.user});
  });

app.get('/delete-project/:id', (req, res) => {
  
  if (!req.session.isLogin){
    req.flash('error', 'Please Login First!')
    res.redirect('/')
}else{
    db.connect(function(err, client, done) {
        if (err) throw err;
        const id = req.params.id
        const query = `DELETE FROM tb_project WHERE id = ${id};`;

        client.query(query, function(err, result) {
            if (err) throw err;
            req.flash('success', 'Projects deleted!')
            res.redirect('/');
        });

        done();
    });
}});

app.get('/project-detail/:id', function (req, res){
  
db.connect(function(err, client, done) {  
    if (err) throw err;
  const id = req.params.id; 
  const query = `SELECT * FROM tb_project WHERE id = ${id}`;

  client.query(query, function (err, result){
    if (err) throw err;
    
    const detailProject = result.rows[0]
    const detail = detailProject;  

    detail.duration = durationTime(detail["start_date"], detail["end_date"]);
    detail.date = getFullTime(detail["start_date"]);
    detail.image = detail.image ? '/uploads/' + detail.image : '/public/assets/my-project-img-detail.png'

    res.render('project-detail', {detail: detail})
    });
    done();
  });
})


app.get('/edit-project/:id', function(req, res){
  if (!req.session.isLogin){
    req.flash('error', 'Please Login First!')
    res.redirect('/')
  }
  db.connect(function(err, client, done){
    if (err) throw err;
    let id = req.params.id;
    const query = `SELECT * FROM tb_project WHERE id =${id}`

    client.query(query, function(err, result) {
        if (err) throw err;
        
        const projects = result.rows[0]
        projects.start_date = changeTime (projects.start_date);   //perubahan 1
        projects.end_date = changeTime (projects.end_date);
        projects.image = projects.image ? '/uploads/' + projects.image : '/public/assets/my-project-img-detail.png'    

         res.render('edit-project', {
          edit: projects,
          id: id,
          isLogin: req.session.isLogin,
          user: req.session.user,
      })
    })
    done()
  })
})

app.get('/login', (req, res) => {
  res.render('login');
})

app.get('/register', (req, res) => {
  res.render('register');
})

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
})



 // Routing POST 
app.post('/contact-me', (req, res) => {
    const data = req.body;

      res.redirect('/contact-me');
  });
  
  
app.post('/add-project', upload.single('image'), (req, res) => {

    const data = req.body;
    const name = req.body.name;
    const start_date = req.body.start_date;
    const end_date = req.body.end_date;
    const description = req.body.description;
    const userId = req.session.user.id
    let fileName = req.file.filename;
    const technologies = [];
    if (req.body.nodejs) {
         technologies.push('nodejs');
     } else {
         technologies.push('')
     }
     if (req.body.reactjs) {
         technologies.push('reactjs');
     } else {
         technologies.push('')
     }
     if (req.body.js) {
         technologies.push('js');
     } else {
         technologies.push('')
     }
     if (req.body.typescript) {
         technologies.push('typescript');
     } else {
         technologies.push('')
     }
   
     db.connect(function (err, client, done) {
      if (err) throw err;
  
      const query = `INSERT INTO tb_project (name, start_date, end_date, description, technologies, image, author_id) 
                     VALUES ('${name}', '${start_date}', '${end_date}', '${description}', ARRAY ['${technologies[0]}', '${technologies[1]}','${technologies[2]}', '${technologies[3]}'], '${fileName}', ${userId});`
  
      client.query(query, function (err, result) {
        if (err) throw err;

        req.flash('success', 'Your Project has been added!')

        projects.push(data);
        console.log(projects);
    

    res.redirect('/');
});

done();
});
});


app.post('/edit-project/:id', upload.single('image'), (req, res) => {
  if (!req.session.isLogin){
    req.flash('error', 'Please Login First!')
    res.redirect('/')
}

  const name = req.body.name;
  const start_date = req.body.start_date;
  const end_date = req.body.end_date;
  const description = req.body.description;
  const fileName = req.file.filename;
  const technologies = [];

  if (req.body.nodejs) {
       technologies.push('nodejs');
   } else {
       technologies.push('')
   }
   if (req.body.reactjs) {
       technologies.push('reactjs');
   } else {
       technologies.push('')
   }
   if (req.body.js) {
       technologies.push('js');
   } else {
       technologies.push('')
   }
   if (req.body.typescript) {
       technologies.push('typescript');
   } else {
       technologies.push('')
   }
 
   console.log();
   db.connect(function (err, client, done) {
    let id = req.params.id
    if (err) throw err;

    const query = `UPDATE tb_project 
    SET name = '${name}', start_date = '${start_date}', end_date = '${end_date}', description = '${description}', technologies = ARRAY ['${technologies[0]}', '${technologies[1]}','${technologies[2]}', '${technologies[3]}'], image='${fileName}' 
    WHERE id=${id};`


    client.query(query, function (err, result) {
      if (err) throw err;
    
    req.flash('success', 'Your Project has been updated!')
      
  res.redirect('/');
});

done();
});
});

app.post('/register', (req, res) => {
  const name = req.body.inputName;
  const email = req.body.inputEmail;
  let password = req.body.inputPassword;

  password = bcrypt.hashSync(password, 10);

  db.connect(function (err, client, done) {
    if (err) throw err;

    const query = `INSERT INTO tb_users (name, email, password) 
                   VALUES ('${name}', '${email}', '${password}')`

    client.query(query, function (err, result) {
      if (err) throw err;

      req.flash('success', 'Register success, please login ...');

      res.redirect('/login');
    });

    done();
  });
});

app.post('/login', (req, res) => {
  const email = req.body.loginEmail;
  const password = req.body.loginPassword;

  if (email == '' || password == '') {
    req.flash('warning', 'Please insert email and password!');
    return res.redirect('/login');
  }

  db.connect(function (err, client, done) {
    if (err) throw err;

    const query = `SELECT * FROM tb_users WHERE email = '${email}';`

    client.query(query, function (err, result) {
      if (err) throw err;

      const data = result.rows;

      if (data.length == 0) {
        req.flash('error', 'Email not found!');
        return res.redirect('/login');
      }

      const isMatch = bcrypt.compareSync(password, data[0].password);

      if (isMatch == false) {
        req.flash('error', 'Password not match!');
        return res.redirect('/login');
      }

      req.session.isLogin = true;
      req.session.user = {
        id: data[0].id,
        email: data[0].email,
        name: data[0].name,
      }

      req.flash('success', `Welcome, ${data[0].email}`);

      res.redirect('/');
    });

    done();
  });
});


app.listen(port, () => {
    console.log(`Server running on PORT: ${port}`);
  });


  

  //function

  function durationTime(start_date, end_date) {
    // Convert Start - End Date to Days
    let newStartDate = new Date(start_date)
    let newEndDate = new Date(end_date)
    let duration = Math.abs(newStartDate - newEndDate)
  
    let day = Math.floor(duration / (1000 * 60 * 60 * 24))
  
    if (day < 30) {
      return day + ` days `
    } 
    
    else {
      let diffMonths = Math.ceil(duration / (1000 * 60 * 60 * 24 * 30));
      if (diffMonths >= 1) {
        return diffMonths + ` months `
      }

      if (diffMonths < 12) {
        return diffMonths + ` months `
      } 
      
      else {
        let diffYears = Math.ceil(duration / (1000 * 60 * 60 * 24 * 30 * 12));
        if (diffYears >= 1) {
          return diffYears + ` years `
        }
      }
    }

    
  };

  function getFullTime(time) {
    time = new Date(time);
    const date = time.getDate();
    const monthIndex = time.getMonth();
    const year = time.getFullYear();
    let hour = time.getHours();
    let minute = time.getMinutes();
   
    const fullTime = `${date} ${month[monthIndex]} ${year}`;
  
    return fullTime;
  }

  function changeTime (time) {  //memunculkan start_date sama end_date pada app.get edit.
    let newTime = new Date (time);
    const date = newTime.getDate ();
    const monthIndex = newTime.getMonth () + 1;
    const year = newTime.getFullYear ();
  
    if(monthIndex<10){
      monthformat = '0' + monthIndex;
    } else {
      monthformat = monthIndex;
    }
  
    if(date<10){
      dateformat = '0' + date;
    } else {
      dateformat = date;
    }
  
    const fullTime = `${year}-${monthformat}-${dateformat}`;
    
    return fullTime;
  }
  