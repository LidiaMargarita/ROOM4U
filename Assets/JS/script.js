// Este código busca el cuadro donde haces clic para abrir la ventana de buscar inmueble.
const barraBusqueda = document.getElementById("barraBusqueda");
// Este busca la ventana que aparece cuando haces clic en la barra de búsqueda.
const ventanaFlotante = document.getElementById("ventanaFlotante");
// Aquí seleccionamos todos los botones donde escoges si buscas "Casa", "Cuarto" o "Departamento".
const botonesOpciones = document.querySelectorAll(".opciones button");
// Aquí seleccionamos todos los botones donde eliges las delegaciones (como "Xochimilco" o "Tláhuac").
const botonesDelegaciones = document.querySelectorAll(".delegaciones button");
// Elementos relacionados con el rango de precios
const rangoBarra = document.getElementById("rangoBarra"); // La barra deslizante
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

// 4. Actualizar los valores en las cajas de texto mientras mueves los botones de la barra
rangoBarra.addEventListener("input", (event) => {
    // Dividimos el valor en los dos extremos (mínimo y máximo)
    const valores = rangoBarra.value.split(",").map(Number);
    minValor.value = valores[0]; // Actualizar el valor mínimo en la caja de texto
    maxValor.value = valores[1]; // Actualizar el valor máximo en la caja de texto
    actualizarFondoBarra(valores[0], valores[1]); // Cambiar el color de la barra
});

// 5. Sincronizar los sliders con las cajas de texto manualmente
minValor.addEventListener("input", () => {
    const minValue = parseInt(minValor.value) || 0; // Aseguramos un valor numérico
    const maxValue = parseInt(maxValor.value) || 20000; // Aseguramos un valor numérico

    // Aseguramos que el mínimo no sea mayor que el máximo
    if (minValue > maxValue) {
        minValor.value = maxValue - 500;
    }
    rangoBarra.value = '${minValor.value},${maxValor.value}';
    actualizarFondoBarra(minValor.value, maxValor.value);
});

maxValor.addEventListener("input", () => {
    const minValue = parseInt(minValor.value) || 0; // Aseguramos un valor numérico
    const maxValue = parseInt(maxValor.value) || 20000; // Aseguramos un valor numérico

    // Aseguramos que el máximo no sea menor que el mínimo
    if (maxValue < minValue) {
        maxValor.value = minValue + 500;
    }
    rangoBarra.value = '${minValor.value},${maxValor.value}';
    actualizarFondoBarra(minValor.value, maxValor.value);
});

// 6. Actualizar el fondo de la barra deslizante para reflejar los valores seleccionados
const actualizarFondoBarra = (min, max) => {
    const porcentajeMin = (min / 20000) * 100; // Calcula porcentaje del rango mínimo
    const porcentajeMax = (max / 20000) * 100; // Calcula porcentaje del rango máximo

    rangoBarra.style.background = `linear-gradient(to right, 
        #ddd ${porcentajeMin}%, 
        #62bb2f ${porcentajeMin}%, 
        #62bb2f ${porcentajeMax}%, 
        #ddd ${porcentajeMax}%)`; // Actualizamos el degradado
};

// 7. Al cargar la página, inicializar el fondo de la barra
const inicializarRango = () => {
    const valores = rangoBarra.value.split(",").map(Number); // Obtener valores iniciales
    minValor.value = valores[0]; // Establecer valor mínimo inicial
    maxValor.value = valores[1]; // Establecer valor máximo inicial
    actualizarFondoBarra(valores[0], valores[1]); // Actualizar el fondo de la barra
};

inicializarRango(); // Ejecutar al cargar la página