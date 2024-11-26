// Manejador de eventos para el formulario de registro
document.getElementById("registroEstudianteForm").addEventListener("submit", function (e) {
    e.preventDefault(); // Previene el envío del formulario

    alert("¡Registro completado con éxito!");
    window.location.href = "../../index.html"; // Redirige a la página principal
});