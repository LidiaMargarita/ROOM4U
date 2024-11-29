// Variables de elementos interactivos
const estrellas = document.querySelectorAll('.estrellas span');
const botonComentar = document.getElementById('botonComentar');
const botonPublicar = document.getElementById('botonPublicar');
const comentarioInput = document.getElementById('comentario');
const listaComentarios = document.getElementById('listaComentarios');
const botonContactar = document.querySelector('.contactar');

// Función para calificar usando estrellas
estrellas.forEach((estrella, index) => {
    estrella.addEventListener('mouseover', () => {
        estrellas.forEach((e, i) => {
            e.style.color = i <= index ? '#ffcc00' : '#ccc'; // Cambia color
        });
    });

    estrella.addEventListener('click', () => {
        estrellas.forEach((e, i) => {
            e.classList.toggle('active', i <= index); // Marca como activo
        });
        alert('Calificaste con ${index + 1} estrellas.');
    });

    estrella.addEventListener('mouseout', () => {
        estrellas.forEach((e) => {
            e.style.color = e.classList.contains('active') ? '#ffcc00' : '#ccc'; // Mantén activa la calificación
        });
    });
});

// Función para habilitar el área de comentarios
botonComentar.addEventListener('click', () => {
    comentarioInput.disabled = false;
    botonPublicar.disabled = false;
    comentarioInput.focus(); // Foco en el área de texto
});

// Publicar comentario
botonPublicar.addEventListener('click', () => {
    const comentarioTexto = comentarioInput.value.trim();
    if (comentarioTexto !== '') {
        const nuevoComentario = document.createElement('li');
        nuevoComentario.textContent = comentarioTexto;
        listaComentarios.appendChild(nuevoComentario);

        // Limpiar el área de texto y deshabilitarla
        comentarioInput.value = '';
        comentarioInput.disabled = true;
        botonPublicar.disabled = true;

        alert('Comentario publicado.');
    } else {
        alert('Escribe un comentario antes de publicar.');
    }
});

// Contactar (simulación de inicio de sesión)
botonContactar.addEventListener('click', () => {
    const usuarioAutenticado = false; // Simula si el usuario ha iniciado sesión

    if (!usuarioAutenticado) {
        alert('Por favor, inicia sesión para contactar al propietario.');
        window.location.href = '../inicio-sesion/index.html'; // Redirige a inicio de sesión
    } else {
        alert('El propietario se contactará contigo lo más pronto posible.');
    }
});