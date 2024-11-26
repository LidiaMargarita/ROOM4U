// Seleccionamos elementos importantes de la página
const barraBusqueda = document.getElementById("barraBusqueda"); // Barra de búsqueda
const ventanaFlotante = document.getElementById("ventanaFlotante"); // Ventana flotante
const botonesOpciones = document.querySelectorAll(".opciones button"); // Botones de opciones (Casa, Cuarto, Departamento)
const botonesDelegaciones = document.querySelectorAll(".delegaciones button"); // Botones de delegaciones

// Elementos relacionados con el rango y valores
const rangoBarra = document.getElementById("rangoBarra"); // Barra de rango única
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

// 4. Actualizar el fondo de la barra para reflejar el rango seleccionado
const actualizarFondoBarra = (min, max) => {
    const porcentajeMin = (min / 20000) * 100; // Calcula el porcentaje del mínimo
    const porcentajeMax = (max / 20000) * 100; // Calcula el porcentaje del máximo

    // Cambia el fondo de la barra para mostrar el rango seleccionado
    rangoBarra.style.background = `linear-gradient(to right, 
        #ddd ${porcentajeMin}%, 
        #62bb2f ${porcentajeMin}%, 
        #62bb2f ${porcentajeMax}%, 
        #ddd ${porcentajeMax}%)`;
};

// 5. Manejar el movimiento de los botones en la barra
rangoBarra.addEventListener("input", (event) => {
    const valores = rangoBarra.value.split(","); // Obtenemos los valores de mínimo y máximo
    const min = parseInt(valores[0]); // Valor mínimo
    const max = parseInt(valores[1]); // Valor máximo

    // Actualizar las cajas de texto con los valores actuales
    minValor.value = min;
    maxValor.value = max;

    // Actualizar el fondo dinámico de la barra
    actualizarFondoBarra(min, max);
});

// 6. Actualizar los sliders al escribir en las cajas de texto
minValor.addEventListener("input", () => {
    let min = parseInt(minValor.value); // Valor mínimo introducido
    let max = parseInt(maxValor.value); // Valor máximo actual

    // Validar que el mínimo no sea mayor que el máximo
    if (min >= max) {
        min = max - 500; // Ajustamos para evitar cruces
        minValor.value = min; // Actualizamos el valor en la caja de texto
    }

    // Actualizar los valores de la barra
    rangoBarra.value = '${min},${max}';
    actualizarFondoBarra(min, max); // Actualizar el fondo
});

maxValor.addEventListener("input", () => {
    let min = parseInt(minValor.value); // Valor mínimo actual
    let max = parseInt(maxValor.value); // Valor máximo introducido

    // Validar que el máximo no sea menor que el mínimo
    if (max <= min) {
        max = min + 500; // Ajustamos para evitar cruces
        maxValor.value = max; // Actualizamos el valor en la caja de texto
    }

    // Actualizar los valores de la barra
    rangoBarra.value = '${min},${max}';
    actualizarFondoBarra(min, max); // Actualizar el fondo
});

// 7. Al cargar la página, inicializar el fondo de la barra
const valoresIniciales = rangoBarra.value.split(","); // Obtenemos los valores iniciales
const minInicial = parseInt(valoresIniciales[0]); // Valor inicial mínimo
const maxInicial = parseInt(valoresIniciales[1]); // Valor inicial máximo
actualizarFondoBarra(minInicial, maxInicial); // Inicializar el fondo dinámico