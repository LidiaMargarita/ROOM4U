// Variables de elementos interactivos
const botonComentar = document.getElementById('botonComentar');
const botonPublicar = document.getElementById('botonPublicar');
const comentarioInput = document.getElementById('comentario');
const listaComentarios = document.getElementById('listaComentarios');
const botonContactar = document.querySelector('.contactar');
const resultadoCalificacion = document.getElementById('resultadoCalificacion');
const estrellas = document.querySelectorAll('.estrella');
let calificacionGuardada = false;


// Selecciona el botón de favorito
const botonFavorito = document.getElementById('botonFavorito');

// Agrega el evento de clic
botonFavorito.addEventListener('click', () => {
    // Alterna la clase "active" para cambiar el estilo
    botonFavorito.classList.toggle('active');

    // Verifica si está activo y muestra un mensaje
    if (botonFavorito.classList.contains('active')) {
        alert('Inmueble agregado a favoritos.');
    } else {
        alert('Inmueble eliminado de favoritos.');
    }
});



//funcion para las estrellas
estrellas.forEach((estrella, index) => {
    estrella.addEventListener('mouseover', () => {
        if (!calificacionGuardada) {
            estrellas.forEach((e, i) => {
                e.style.backgroundColor = i <= index ? '#ffd700' : '#ccc'; // Colorea temporalmente
            });
        }
    });

    estrella.addEventListener('click', () => {
        if (!calificacionGuardada) {
            calificacionGuardada = true; // Bloquea cambios
            estrellas.forEach((e, i) => {
                e.classList.toggle('active', i <= index); // Marca como activo
            });
            alert('Calificaste');
        }
    });

    estrella.addEventListener('mouseout', () => {
        if (!calificacionGuardada) {
            estrellas.forEach(e => {
                e.style.backgroundColor = e.classList.contains('active') ? '#ffd700' : '#ccc'; // Restablece color
            });
        }
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

// Función para manejar el botón Contactar
botonContactar.addEventListener('click', () => {
    const usuarioAutenticado = true; // Cambia según la lógica de backend

    if (!usuarioAutenticado) {
        alert('Por favor, inicia sesión para contactar al propietario.');
        window.location.href = '../inicio-sesion/index.html'; // Redirige a inicio de sesión
    } else {
        alert('El propietario se contactará contigo lo más pronto posible.');
    }
});