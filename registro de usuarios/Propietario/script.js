document.getElementById("registroForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const celular = document.getElementById("celular").value.trim();
    const correo = document.getElementById("correo").value.trim();
    const contraseña = document.getElementById("contraseña").value.trim();

    // Validar número de celular
    if (!/^\d{10}$/.test(celular)) {
        alert("Por favor, ingresa un número de celular válido (10 dígitos).");
        document.getElementById("celular").style.borderColor = "red";
        return;
    }

    // Validar correo electrónico
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
        alert("Por favor, ingresa un correo electrónico válido.");
        document.getElementById("correo").style.borderColor = "red";
        return;
    }

    // Validar contraseña
    if (contraseña.length < 8) {
        alert("La contraseña debe tener al menos 8 caracteres.");
        document.getElementById("contraseña").style.borderColor = "red";
        return;
    }

    alert("Registro exitoso. ¡Bienvenido a Room4U!");
});