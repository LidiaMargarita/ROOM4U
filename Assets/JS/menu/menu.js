document.addEventListener("DOMContentLoaded", () => {
    // Seleccionar el botón del menú hamburguesa y el menú desplegable
    const menuToggle = document.getElementById("menuToggle");
    const menu = document.getElementById("menu");

    // Agregar un evento de clic al botón hamburguesa
    menuToggle.addEventListener("click", () => {
        // Mostrar u ocultar el menú desplegable
        if (menu.style.display === "block") {
            menu.style.display = "none"; // Ocultar el menú
        } else {
            menu.style.display = "block"; // Mostrar el menú
        }
    });
});