// Función para redirigir a la página de gestión de inmuebles
function gestionarInmueble(id) {
    // Aquí redirigimos a la página de gestión
    window.location.href = '../gestion-inmuebles/index.html?inmueble=${id}';
}