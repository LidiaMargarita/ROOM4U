// Validación del formulario
document.getElementById("loginForm").addEventListener("submit", function (e) {
    
    
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Validación simple para el correo
    if (!validateEmail(email)) {
        alert("Por favor, ingresa un correo válido.");
        return;
    }

    // Validación simple para contraseña vacía
    if (password.trim() === "") {
        alert("Por favor, ingresa tu contraseña.");
        return;
    }

    // Redirección si es exitoso
    alert("Inicio de sesión exitoso.");
    window.location.href = "../index.html"; // Redirigir a la página principal
});

// Validación de formato de correo
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Enlace para "Regístrate"
document.getElementById("register-link").addEventListener("click", function (e) {
    e.preventDefault(); // Previene el comportamiento predeterminado del enlace
    window.location.href = "../registro de usuarios/index.html"; // Redirige a la página de registro
});

// Función para mostrar/ocultar contraseña
document.getElementById("togglePassword").addEventListener("click", function () {
    const passwordField = document.getElementById("password");
    const type = passwordField.getAttribute("type") === "password" ? "text" : "password";
    passwordField.setAttribute("type", type);

    // Cambiar el ícono según el estado
    this.textContent = type === "password" ? "👁️" : "🙈";
});

// Enlace para "Olvidé mi contraseña"
document.getElementById("forgot-password").addEventListener("click", function (e) {
    e.preventDefault(); // Previene el comportamiento predeterminado
    // Redirige a la página de recuperar contraseña
    window.location.href = "../inicio-sesion/recuperar/index.html";
});