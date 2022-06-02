function submitForm() {
  const emailReceiver = "nurulanisah18@gmail.com";

  let name = document.getElementById("input-name").value;
  let email = document.getElementById("input-email").value;
  let phone = document.getElementById("input-phone").value;
  let subject = document.getElementById("choose-subject").value;
  let message = document.getElementById("input-message").value;

  if (
    name === "" ||
    email === "" ||
    phone === "" ||
    subject === "" ||
    message === ""
  ) {
    alert("Pleas fill all the form...");
  }

  let a = document.createElement("a");
  a.href = `mailto:${emailReceiver}?subject=${subject}&body=Hallo please let me introduce my self, my name is ${name}. I wanted to ${subject}, ${message} .Thank You`;
  a.click();
}
