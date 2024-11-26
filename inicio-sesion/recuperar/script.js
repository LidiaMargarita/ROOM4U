document.addEventListener("DOMContentLoaded", () => {
    const recuperarForm = document.getElementById("recuperarForm");

    recuperarForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const email = document.getElementById("email").value;

        if (!email) {
            alert("Por favor, ingresa un correo electrónico.");
            return;
        }

        // Simulación de envío de correo
        alert("Enviamos tu contraseña a tu correo.");
    });
});