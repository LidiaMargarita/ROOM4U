// Seleccionamos elementos importantes de la página
const barraBusqueda = document.getElementById("barraBusqueda"); // Barra de búsqueda
const ventanaFlotante = document.getElementById("ventanaFlotante"); // Ventana flotante
const botonesOpciones = document.querySelectorAll(".opciones button"); // Botones de opciones (Casa, Cuarto, Departamento)
const botonesDelegaciones = document.querySelectorAll(".delegaciones button"); // Botones de delegaciones

// Elementos relacionados con el rango y valores
const rangoMin = document.getElementById("rangoMin"); // Control deslizante mínimo
const rangoMax = document.getElementById("rangoMax"); // Control deslizante máximo
const minValor = document.getElementById("minValor"); // Caja de texto para el valor mínimo
const maxValor = document.getElementById("maxValor"); // Caja de texto para el valor máximo

// 1. Mostrar y ocultar la ventana flotante al hacer clic en la barra de búsqueda
barraBusqueda.addEventListener("click", () => {
    // Cambia entre mostrar ("block") y ocultar ("none") la ventana flotante
    if (ventanaFlotante.style.display === "block") {
        ventanaFlotante.style.display = "none";
    } else {
        ventanaFlotante.style.display = "block";
    }
});

// 2. Manejar los clics en los botones de opciones (Casa, Cuarto, Departamento)
botonesOpciones.forEach((button) => {
    button.addEventListener("click", () => {
        // Alterna el estilo "active" para marcar/desmarcar los botones
        button.classList.toggle("active");
    });
});

// 3. Manejar los clics en los botones de delegaciones
botonesDelegaciones.forEach((button) => {
    button.addEventListener("click", () => {
        button.classList.toggle("active");
    });
});

// 4. Actualizar el fondo de la barra deslizante para reflejar los valores seleccionados
const actualizarFondoBarra = () => {
    const min = parseInt(rangoMin.value); // Valor actual del control deslizante mínimo
    const max = parseInt(rangoMax.value); // Valor actual del control deslizante máximo
    const porcentajeMin = (min / 50000) * 100; // Calcula porcentaje del rango mínimo
    const porcentajeMax = (max / 50000) * 100; // Calcula porcentaje del rango máximo

    // Cambiar el fondo para mostrar los rangos seleccionados
    rangoMin.style.background = 'linear-gradient(to right, #ddd ${porcentajeMin}%, #FFD700 ${porcentajeMin}%, #FFD700 ${porcentajeMax}%, #ddd ${porcentajeMax}%)';
    rangoMax.style.background = rangoMin.style.background; // Sincroniza ambos controles
};

// 5. Actualizar los valores y restricciones del rango al mover los sliders
rangoMin.addEventListener("input", () => {
    const minValue = parseInt(rangoMin.value);
    const maxValue = parseInt(rangoMax.value);

    if (minValue >= maxValue) {
        rangoMin.value = maxValue - 500; // Restringir el mínimo para no pasar al máximo
    }
    minValor.value = rangoMin.value; // Actualizar la caja de texto para el valor mínimo
    actualizarFondoBarra(); // Actualizar el fondo
});

rangoMax.addEventListener("input", () => {
    const minValue = parseInt(rangoMin.value);
    const maxValue = parseInt(rangoMax.value);

    if (maxValue <= minValue) {
        rangoMax.value = minValue + 500; // Restringir el máximo para no pasar al mínimo
    }
    maxValor.value = rangoMax.value; // Actualizar la caja de texto para el valor máximo
    actualizarFondoBarra(); // Actualizar el fondo
});

// 6. Actualizar los sliders al escribir en las cajas de texto
minValor.addEventListener("input", () => {
    const minValue = parseInt(minValor.value);
    const maxValue = parseInt(maxValor.value);

    if (minValue >= maxValue) {
        minValor.value = maxValue - 500; // Restringir el mínimo al máximo
    }
    rangoMin.value = minValor.value; // Actualizar el slider mínimo
    actualizarFondoBarra(); // Actualizar el fondo
});

maxValor.addEventListener("input", () => {
    const minValue = parseInt(minValor.value);
    const maxValue = parseInt(maxValor.value);

    if (maxValue <= minValue) {
        maxValor.value = minValue + 500; // Restringir el máximo al mínimo
    }
    rangoMax.value = maxValor.value; // Actualizar el slider máximo
    actualizarFondoBarra(); // Actualizar el fondo
});

// 7. Al cargar la página, inicializar el fondo de la barra
actualizarFondoBarra();