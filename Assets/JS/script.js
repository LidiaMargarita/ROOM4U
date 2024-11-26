// Seleccionamos elementos importantes de la página
const barraBusqueda = document.getElementById("barraBusqueda"); // Barra de búsqueda
const ventanaFlotante = document.getElementById("ventanaFlotante"); // Ventana flotante
const botonesOpciones = document.querySelectorAll(".opciones button"); // Botones de opciones (Casa, Cuarto, Departamento)
const botonesDelegaciones = document.querySelectorAll(".delegaciones button"); // Botones de delegaciones

// Elementos relacionados con el rango y valores
const rangoBarra = document.getElementById("rangoBarra"); // Barra deslizante
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

// 4. Actualizar los valores mínimo y máximo al mover las bolitas del rango
const actualizarValores = () => {
    const [min, max] = rangoBarra.value.split(",").map(Number); // Obtenemos los valores mínimo y máximo
    minValor.value = min; // Actualizamos la caja de texto para el mínimo
    maxValor.value = max; // Actualizamos la caja de texto para el máximo
};

// 5. Actualizar la posición de las bolitas del rango cuando se escriben valores en las cajas de texto
const actualizarBarra = () => {
    const min = parseInt(minValor.value) || 0; // Valor del mínimo (o 0 si no hay valor)
    const max = parseInt(maxValor.value) || 20000; // Valor del máximo (o 20000 si no hay valor)
    // Validamos que el mínimo no sea mayor que el máximo y viceversa
    if (min >= max) {
        minValor.value = max - 500; // Ajustamos el mínimo
    } else if (max <= min) {
        maxValor.value = min + 500; // Ajustamos el máximo
    }
    rangoBarra.value = '${min},${max}'; // Actualizamos la barra deslizante
};

// 6. Detectar cambios en la barra deslizante y actualizar los valores
rangoBarra.addEventListener("input", actualizarValores);

// 7. Detectar cambios en las cajas de texto y actualizar la barra deslizante
minValor.addEventListener("input", actualizarBarra);
maxValor.addEventListener("input", actualizarBarra);

// 8. Establecer valores iniciales al cargar la página
actualizarValores();