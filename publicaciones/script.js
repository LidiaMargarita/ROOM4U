// Manejo del botón "Favorito"
document.querySelectorAll('.favorito').forEach(button => {
    button.addEventListener('click', () => {
        alert('Añadido a favoritos');
        // Aquí se podría agregar la lógica para guardar en favoritos
    });
});

// Manejo del botón "Detalles"
document.querySelectorAll('.detalles').forEach(button => {
    button.addEventListener('click', () => {
        alert('Ir a los detalles de la publicación');
        // Aquí se podría redirigir a la página de detalles
        // Por ejemplo: window.location.href = "./detalles.html";
    });
});