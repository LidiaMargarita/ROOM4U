// Datos simulados de publicaciones
const publicaciones = [
    { tipo: "Departamento", precio: 6000, ubicacion: "Lerma", descripcion: "Hermoso departamento en Lerma" },
    { tipo: "Cuarto", precio: 4000, ubicacion: "ESIME", descripcion: "Cuarto cerca de ESIME" },
    { tipo: "Departamento", precio: 7000, ubicacion: "Doctores", descripcion: "Renta en Colonia Doctores" },
    { tipo: "Cuarto", precio: 4500, ubicacion: "Tomatlán", descripcion: "Cuarto cerca del metro Tomatlán" }
];

// Función para capturar parámetros de la URL
function getParametrosURL() {
    const params = new URLSearchParams(window.location.search);
    return {
        tipo: params.get("tipo"),
        presupuesto: parseInt(params.get("presupuesto"))
    };
}

// Filtrar publicaciones según los parámetros
function filtrarPublicaciones(filtros) {
    return publicaciones.filter(pub => 
        pub.tipo === filtros.tipo && pub.precio <= filtros.presupuesto
    );
}

// Renderizar publicaciones en la página
function renderizarPublicaciones(publicacionesFiltradas) {
    const contenedor = document.querySelector(".publicaciones-contenedor");
    contenedor.innerHTML = ""; // Limpia el contenedor

    publicacionesFiltradas.forEach(pub => {
        const publicacionHTML = `
            <div class="publicacion">
                <div class="imagen">FOTO</div>
                <div class="descripcion">
                    <p>${pub.descripcion}</p>
                    <div class="acciones">
                        <button class="detalles">Detalles</button>
                        <button class="favorito">&#10084;</button>
                    </div>
                </div>
            </div>
        `;
        contenedor.innerHTML += publicacionHTML;
    });
}

// Lógica principal
const filtros = getParametrosURL(); // Captura los filtros
const publicacionesFiltradas = filtrarPublicaciones(filtros); // Filtra las publicaciones
renderizarPublicaciones(publicacionesFiltradas); // Muestra las publicaciones filtradas