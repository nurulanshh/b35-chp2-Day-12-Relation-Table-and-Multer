let projects = [];

function addProject() {
  
  let name = document.getElementById('input-project-name').value;
  let description = document.getElementById('input-description').value;

  let startDate = document.getElementById('input-start-date').value;
  let endDate = document.getElementById('input-end-date').value;

  let image = document.getElementById('input-project-image').files[0];
  image = URL.createObjectURL(image);

  let technologies = Array.from(document.querySelectorAll('input[type=checkbox]:checked')).map(item => item.value);

  let project = {
    author: 'Nurul Anisah',
    name,
    startDate,
    endDate,
    description,
    image,
    technologies,
  };
  
  console.log(project)

  projects.push(project);
  renderProjects();
}

function renderProjects() {

  lengthData = projects.length;
  let projectContainer = document.getElementById("contents");
  projectContainer.innerHTML = firstProjectContent();

  let i = 0;
  for (i; i < lengthData; i++) {

    let icons = projects[i].technologies.map(value => `<img src="assets/${value}">`)
   
    projectContainer.innerHTML += `
      <div class="col-lg-4">
        <div class="card-project shadow">
          <div class="card-body-project m-3">
            <div class="my-project-img">
              <img  class="mt-3" src="${projects[i].image}" alt="cover">
            </div>
             <h5 class="mt-3 fw-bold">${projects[i].name}</h5>
            <div class="detail-project-content mb-3">
             duration : ${durationTime(projects[i].startDate, projects[i].endDate)}
            </div>
            <p class="fw-semibold">${projects[i].description}
             </p>
              <div class="logo d-flex align-items-center mb-3">
                 <div class="nodejs">
                 `+ icons + `
                 </div>    
              </div>                
            <div class="text-end mt-4">
              <button class="btn bg-black text-white mb-3 fw-semibold">edit</button>
              <button class="btn bg-black text-white mb-3 fw-semibold">delete</button>
            </div> 
         </div>     
         </div>
       </div>
        
    </div>
  </div>  
      `;

}

  // Non Looping 2x
  function firstProjectContent() {
    return `<div class="col-lg-4">
        <div class="card-project shadow">
          <div class="card-body-project m-3">
            <div class="my-project-img">
              <img  class="mt-3" src="assets/my-project-img-detail.png" alt="cover">
            </div>
             <h5 class="mt-3 fw-bold">Dumbways Web App - 2021</h5>
            <div class="detail-project-content mb-3">
             duration : 3 month
            </div>
            <p class="fw-semibold">App that used for dumbways student, it was deployed and can downloaded on playstore.
              Happy download
             </p>
              <div class="logo d-flex align-items-center mb-3">
                 <div class="nodejs">
                   <img src="assets/nodejs.png" alt="ns" id="nss">
                 </div>
                 <div class="reactjs">
                   <img src="assets/reactjs.png" alt="rs" id="rss">
                 </div>
                 <div class="javascript">
                   <img src="assets/js.png" alt="js" id="jss">
                 </div>
                 <div class="typescript">
                   <img src="assets/typescript.png" alt="ts" id="tss">
                 </div>    
              </div>                
            <div class="text-end mt-4">
              <button class="btn bg-black text-white mb-3 fw-semibold">edit</button>
              <button class="btn bg-black text-white mb-3 fw-semibold">delete</button>
            </div> 
         </div>     
         </div>
       </div>
        
    </div>
  </div>  `;
}



}
  


function durationTime(startDate, endDate) {
  // Convert Start - End Date to Days
  let newStartDate = new Date(startDate)
  let newEndDate = new Date(endDate)
  let duration = Math.abs(newStartDate - newEndDate)

  let day = Math.floor(duration / (1000 * 60 * 60 * 24))

  if (day < 30) {
    return day + ` days `
  } else {
    let diffMonths = Math.ceil(duration / (1000 * 60 * 60 * 24 * 30));
    if (diffMonths >= 1) {
      return diffMonths + ` months `
    }

  }
  if (diffMonths < 12) {
    return diffMonths + ` months `
  } else {
    let diffYears = Math.ceil(duration / (1000 * 60 * 60 * 24 * 30 * 12));
    if (diffYears >= 1) {
      return diffYears + ` years `
    }

  }
};
