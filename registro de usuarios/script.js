// Redirige según el tipo de usuario seleccionado
document.getElementById("estudianteButton").addEventListener("click", function () {
    window.location.href = "./registro-estudiante/index.html"; // Redirige a la página de registro de estudiante
});

document.getElementById("propietarioButton").addEventListener("click", function () {
    window.location.href = "./registro-propietario/index.html"; // Redirige a la página de registro de propietario
});