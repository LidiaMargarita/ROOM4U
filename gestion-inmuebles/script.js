// Botón "Disponible/Ocupado"
const statusButton = document.querySelector(".status");
statusButton.addEventListener("click", () => {
    if (statusButton.classList.contains("available")) {
        statusButton.textContent = "Ocupado";
        statusButton.classList.remove("available");
        statusButton.classList.add("occupied");
    } else {
        statusButton.textContent = "Disponible";
        statusButton.classList.remove("occupied");
        statusButton.classList.add("available");
    }
});

// Botón "Asignar Cliente"
const assignClientButton = document.querySelector(".assign-client");
assignClientButton.addEventListener("click", () => {
    alert("Muestra lista de clientes disponibles (por implementar)");
});

// Botón "Eliminar"
const deleteButton = document.querySelector(".delete");
deleteButton.addEventListener("click", () => {
    const confirmation = confirm("¿Estás seguro de eliminar este inmueble?");
    if (confirmation) {
        alert("Inmueble eliminado (por implementar)");
    }
});

// Botón "Guardar datos"
const saveButton = document.querySelector(".save");
saveButton.addEventListener("click", () => {
    alert("Datos guardados correctamente (por implementar)");
});

// Botón "Editar Inmueble"
const editButton = document.getElementById("editInmueble");
editButton.addEventListener("click", () => {
    alert("Función para editar inmueble (por implementar)");
});