// Este código busca el cuadro donde haces clic para abrir la ventana de buscar inmueble.
const barraBusqueda = document.getElementById("barraBusqueda");
// Este busca la ventana que aparece cuando haces clic en la barra de búsqueda.
const ventanaFlotante = document.getElementById("ventanaFlotante");
// Aquí seleccionamos todos los botones donde escoges "Casa", "Cuarto" o "Departamento".
const botonesOpciones = document.querySelectorAll(".opciones button");
// Aquí seleccionamos todos los botones donde eliges las delegaciones.
const botonesDelegaciones = document.querySelectorAll(".delegaciones button");

// Buscamos el control deslizante y las cajitas donde se escriben los números de rango.
const rango = document.getElementById("rangoBarra"); // Barra deslizante
const minValor = document.getElementById("minValor"); // Caja de texto para el valor mínimo
const maxValor = document.getElementById("maxValor"); // Caja de texto para el valor máximo

// Inicializamos los valores mínimos y máximos
let min = 0;
let max = 20000;

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

// 4. Función para actualizar los valores en los cuadros de texto al mover los botones de la barra
const actualizarValores = () => {
    const valores = rango.value.split(",").map(Number); // Obtenemos los valores de los botones
    min = valores[0]; // Actualizamos el valor mínimo
    max = valores[1]; // Actualizamos el valor máximo

    minValor.value = min; // Mostramos el valor mínimo en la caja
    maxValor.value = max; // Mostramos el valor máximo en la caja
};

// 5. Escuchar el movimiento de los botones en la barra deslizante
rango.addEventListener("input", () => {
    actualizarValores(); // Actualizamos los valores dinámicamente
});

// 6. Actualizar la barra al escribir en las cajas de texto
minValor.addEventListener("input", () => {
    min = parseInt(minValor.value) || 0; // Asegurarnos de que sea un número
    if (min >= max) {
        min = max - 1; // Restringir para que no supere el máximo
        minValor.value = min; // Corregir el valor en la caja
    }
    rango.value = '${min},${max}'; // Actualizar la posición de los botones en la barra
});

maxValor.addEventListener("input", () => {
    max = parseInt(maxValor.value) || 20000; // Asegurarnos de que sea un número
    if (max <= min) {
        max = min + 1; // Restringir para que no sea menor que el mínimo
        maxValor.value = max; // Corregir el valor en la caja
    }
    rango.value = '${min},${max}'; // Actualizar la posición de los botones en la barra
});

// 7. Inicializar los valores al cargar la página
rango.value = '${min},${max}'; // Configurar los valores iniciales en la barra
actualizarValores(); // Mostrar los valores iniciales en las cajas