function canAccess(){
    if (isLogged) {
      alert("Solo puedes entrar a esta pagina si aun no estas logueado");
      window.location.href = 'index.html'
    }
}
  
canAccess();
  
const student = document.querySelector("#student-button");
const owner = document.querySelector("#owner-button");

student.addEventListener("click", function() {
    window.location.href = "register-user.html";
});

owner.addEventListener("click", function() {
    window.location.href = "register-owner.html";
});

