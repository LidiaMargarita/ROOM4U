// Simulación de inmuebles publicados (puede conectarse a un backend más adelante)
const inmuebles = [
    { id: 1, titulo: "Departamento en el Centro", direccion: "Calle Falsa 123", precio: "$8,000" },
    { id: 2, titulo: "Cuarto cerca del Metro", direccion: "Av. Principal 456", precio: "$4,000" },
    { id: 3, titulo: "Casa en Zona Residencial", direccion: "Colonia Vista Hermosa", precio: "$12,000" },
];

// Función para renderizar los inmuebles en la lista
function renderizarInmuebles() {
    const contenedor = document.getElementById("inmueblesLista");

    // Limpiar el contenedor antes de renderizar
    contenedor.innerHTML = "";

    // Recorrer la lista de inmuebles y crear botones dinámicos
    inmuebles.forEach((inmueble) => {
        const boton = document.createElement("button");
        boton.classList.add("inmueble-boton");
        boton.innerHTML = `
            <strong>${inmueble.titulo}</strong><br>
            <span>${inmueble.direccion}</span><br>
            <span>${inmueble.precio}</span>
        `;
        boton.addEventListener("click", () => gestionarInmueble(inmueble.id));
        contenedor.appendChild(boton);
    });
}

// Redirigir a la página de gestión de inmuebles
function gestionarInmueble(id) {
    window.location.href = '../gestion-inmuebles/index.html?inmueble=${id}';
}

// Renderizar los inmuebles al cargar la página
document.addEventListener("DOMContentLoaded", renderizarInmuebles);