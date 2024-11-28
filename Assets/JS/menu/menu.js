document.addEventListener("DOMContentLoaded", () => {
    // Seleccionar el botón del menú hamburguesa y el menú desplegable
    const menuToggle = document.getElementById("menuToggle");
    const menu = document.getElementById("menu");

    // Simulación del rol del usuario (cambiar a 'estudiante' o 'propietario' según sea necesario)
    let userRole = "propietario"; // Cambia este valor para simular diferentes roles

    // Configurar el menú según el rol del usuario
    const actualizarMenuPorRol = (rol) => {
        if (rol === "propietario") {
            menu.innerHTML = `
                <li><a href="../publicar/index.html">Publicar</a></li>
                <li><a href="../mis-inmuebles/index.html">Mis inmuebles</a></li>
                <li><a href="../cerrar-sesion/index.html">Cerrar sesión</a></li>
            `;
        } else if (rol === "estudiante") {
            menu.innerHTML = `
                <li><a href="../favoritos/index.html">Favoritos</a></li>
                <li><a href="../cerrar-sesion/index.html">Cerrar sesión</a></li>
            `;
        } else {
            // Por si el usuario no está autenticado
            menu.innerHTML = `
                <li><a href="../inicio-sesion/index.html">Iniciar sesión</a></li>
            `;
        }
    };

    // Actualizar el menú al cargar la página
    actualizarMenuPorRol(userRole);

    // Agregar un evento de clic al botón hamburguesa
    menuToggle.addEventListener("click", () => {
        // Mostrar u ocultar el menú desplegable
        menu.style.display = menu.style.display === "block" ? "none" : "block";
    });
});