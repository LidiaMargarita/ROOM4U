document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.getElementById("menuToggle");
    const menu = document.getElementById("menu");

    // Simular estado del usuario para pruebas
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"; // Verifica si el usuario está logueado
    const userType = localStorage.getItem("userType"); // Puede ser "propietario" o "estudiante"

    // Identificar si estamos en la página principal
    const isPaginaPrincipal = window.location.pathname.includes("index.html");

    const configurarMenu = () => {
        // Si el usuario está logueado
        if (isLoggedIn) {
            if (userType === "propietario") {
                menu.innerHTML = `
                    <li><a href="../publicar/index.html">Publicar</a></li>
                    <li><a href="../mis-inmuebles/index.html">Mis inmuebles</a></li>
                    <li><a href="../cerrar-sesion/index.html" onclick="cerrarSesion()">Cerrar sesión</a></li>
                `;
            } else if (userType === "estudiante") {
                menu.innerHTML = `
                    <li><a href="../favoritos/index.html">Favoritos</a></li>
                    <li><a href="../cerrar-sesion/index.html" onclick="cerrarSesion()">Cerrar sesión</a></li>
                `;
            }
        } else {
            // Si no ha iniciado sesión
            if (isPaginaPrincipal) {
                menu.innerHTML = `
                    <li><a href="./inicio-sesion/index.html">Iniciar sesión</a></li>
                    <li><a href="./publicar/index.html">Publicar</a></li>
                    <li><a href="./favoritos/index.html">Favoritos</a></li>
                `;
            } else {
                menu.innerHTML = `
                    <li><a href="../inicio-sesion/index.html">Iniciar sesión</a></li>
                    <li><a href="../publicar/index.html">Publicar</a></li>
                    <li><a href="../favoritos/index.html">Favoritos</a></li>
                `;
            }
        }
    };

    // Función para cerrar sesión
    window.cerrarSesion = function () {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("userType");
        alert("Sesión cerrada correctamente.");
        window.location.href = "../index.html"; // Redirige a la página principal
    };

    // Ejecutar la configuración del menú
    configurarMenu();

    // Evento para mostrar/ocultar el menú
    menuToggle.addEventListener("click", () => {
        menu.style.display = menu.style.display === "block" ? "none" : "block";
    });
});