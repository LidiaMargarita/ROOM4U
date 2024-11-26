// Este código busca el cuadro donde haces clic para abrir la ventana de buscar inmueble.
const barraBusqueda = document.getElementById("barraBusqueda");
// Este busca la ventana que aparece cuando haces clic en la barra de búsqueda.
const ventanaFlotante = document.getElementById("ventanaFlotante");
// Aquí seleccionamos todos los botones donde escoges "Casa", "Cuarto" o "Departamento".
const botonesOpciones = document.querySelectorAll(".opciones button");
// Aquí seleccionamos todos los botones donde eliges las delegaciones (como "Xochimilco" o "Tláhuac").
const botonesDelegaciones = document.querySelectorAll(".delegaciones button");

// Elementos relacionados con el rango y valores
const rangoBarra = document.getElementById("rangoBarra"); // Barra deslizante única
const minValor = document.getElementById("minValor"); // Caja de texto para el valor mínimo
const maxValor = document.getElementById("maxValor"); // Caja de texto para el valor máximo

// Variables para los valores del rango
let min = 0; // Valor inicial del rango mínimo
let max = 20000; // Valor inicial del rango máximo

// 1. Mostrar y ocultar la ventana flotante al hacer clic en la barra de búsqueda
barraBusqueda.addEventListener("click", () => {
    // Cambia entre mostrar ("block") y ocultar ("none") la ventana flotante
    ventanaFlotante.style.display = ventanaFlotante.style.display === "block" ? "none" : "block";
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
    // Convertir los valores actuales a porcentajes
    const porcentajeMin = (min / 20000) * 100;
    const porcentajeMax = (max / 20000) * 100;

    // Cambiar el fondo de la barra para mostrar los rangos seleccionados
    rangoBarra.style.background = 'linear-gradient(to right, #ddd ${porcentajeMin}%, #62bb2f ${porcentajeMin}%, #62bb2f ${porcentajeMax}%, #ddd ${porcentajeMax}%)';
};

// 5. Actualizar los valores y restricciones del rango al mover la barra deslizante
rangoBarra.addEventListener("input", () => {
    const valor = parseInt(rangoBarra.value);

    // Determinar si se ajusta el mínimo o el máximo según la posición del valor
    if (Math.abs(valor - min) < Math.abs(valor - max)) {
        min = Math.min(valor, max - 500); // Asegurarse de que mínimo no pase el máximo
        minValor.value = min; // Actualizar la caja de texto del mínimo
    } else {
        max = Math.max(valor, min + 500); // Asegurarse de que máximo no pase el mínimo
        maxValor.value = max; // Actualizar la caja de texto del máximo
    }

    // Actualizar el fondo de la barra
    actualizarFondoBarra();
});

// 6. Actualizar la barra deslizante cuando se escriben valores en las cajas de texto
[minValor, maxValor].forEach((input, index) => {
    input.addEventListener("input", () => {
        const valor = parseInt(input.value);

        if (index === 0) {
            // Si se está escribiendo en el mínimo
            min = Math.min(valor, max - 500); // Restringir mínimo al máximo
            rangoBarra.value = min; // Actualizar la barra deslizante
        } else {
            // Si se está escribiendo en el máximo
            max = Math.max(valor, min + 500); // Restringir máximo al mínimo
            rangoBarra.value = max; // Actualizar la barra deslizante
        }

        // Actualizar el fondo de la barra
        actualizarFondoBarra();
    });
});

// 7. Al cargar la página, inicializar el fondo de la barra
actualizarFondoBarra();