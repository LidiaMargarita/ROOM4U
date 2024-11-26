// Este código busca el cuadro donde haces clic para abrir la ventana de buscar inmueble.
const barraBusqueda = document.getElementById("barraBusqueda");
// Este busca la ventana que aparece cuando haces clic en la barra de búsqueda.
const ventanaFlotante = document.getElementById("ventanaFlotante");
// Aquí seleccionamos todos los botones donde escoges "Casa", "Cuarto" o "Departamento".
const botonesOpciones = document.querySelectorAll(".opciones button");
// Aquí seleccionamos todos los botones donde eliges las delegaciones.
const botonesDelegaciones = document.querySelectorAll(".delegaciones button");
// Seleccionamos los elementos necesarios
const slider = document.getElementById("slider");
const botonMin = document.getElementById("botonMin");
const botonMax = document.getElementById("botonMax");
const minValor = document.getElementById("minValor");
const maxValor = document.getElementById("maxValor");

// Rango mínimo y máximo permitidos
const rangoMin = 0;
const rangoMax = 20000;

// Estado inicial de los valores
let min = parseInt(minValor.value);
let max = parseInt(maxValor.value);

// Función para actualizar las posiciones de los botones
function actualizarPosiciones() {
    const sliderWidth = slider.offsetWidth;
    const botonWidth = botonMin.offsetWidth;
    const minLeft = ((min - rangoMin) / (rangoMax - rangoMin)) * sliderWidth - botonWidth / 2;
    const maxLeft = ((max - rangoMin) / (rangoMax - rangoMin)) * sliderWidth - botonWidth / 2;

    botonMin.style.left = '${Math.max(0, Math.min(sliderWidth - botonWidth, minLeft))}px';
    botonMax.style.left = '${Math.max(0, Math.min(sliderWidth - botonWidth, maxLeft))}px';

    slider.style.background = 'linear-gradient(to right, #ddd ${minLeft + botonWidth / 2}px, #0cc0df ${minLeft + botonWidth / 2}px, #0cc0df ${maxLeft + botonWidth / 2}px, #ddd ${maxLeft + botonWidth / 2}px)';
}

// Eventos para mover el botón mínimo
botonMin.addEventListener("mousedown", (e) => {
    const sliderWidth = slider.offsetWidth;
    const startX = e.clientX;

    const onMouseMove = (e) => {
        const deltaX = e.clientX - startX;
        const porcentaje = deltaX / sliderWidth;
        const nuevoMin = Math.round(min + porcentaje * (rangoMax - rangoMin));

        if (nuevoMin >= rangoMin && nuevoMin <= max - 500) {
            min = nuevoMin;
            minValor.value = min;
            actualizarPosiciones();
        }
    };

    const onMouseUp = () => {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
});

// Eventos para mover el botón máximo
botonMax.addEventListener("mousedown", (e) => {
    const sliderWidth = slider.offsetWidth;
    const startX = e.clientX;

    const onMouseMove = (e) => {
        const deltaX = e.clientX - startX;
        const porcentaje = deltaX / sliderWidth;
        const nuevoMax = Math.round(max + porcentaje * (rangoMax - rangoMin));

        if (nuevoMax <= rangoMax && nuevoMax >= min + 500) {
            max = nuevoMax;
            maxValor.value = max;
            actualizarPosiciones();
        }
    };

    const onMouseUp = () => {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
});

// Actualizar los valores al escribir en las cajas
minValor.addEventListener("input", () => {
    const nuevoMin = parseInt(minValor.value);
    if (nuevoMin >= rangoMin && nuevoMin <= max - 500) {
        min = nuevoMin;
        actualizarPosiciones();
    }
});

maxValor.addEventListener("input", () => {
    const nuevoMax = parseInt(maxValor.value);
    if (nuevoMax <= rangoMax && nuevoMax >= min + 500) {
        max = nuevoMax;
        actualizarPosiciones();
    }
});

// Inicializar las posiciones
actualizarPosiciones();