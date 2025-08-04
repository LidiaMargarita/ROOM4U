function canAccess(){
    mustBeLogin();

    if(userType == 1){
        alert("Esta pagina solo esta disponible para propietarios");
        window.location.href = 'index.html'
    }
}

canAccess();
  

const container = document.querySelector('.my-properties-container');
const isAvailable = (available) => available ? 'Disponible' : 'No disponible';
let counter = 0;

async function checkAPI() {
    try {
        const response = await fetch(`${API_URL}/getmyproperties`, {
            method: 'GET',
            headers: {
                authorization: token
            }
        });

        if (response.ok) {
            const data = await response.json();
            data.forEach(property => {
                const propertyElement = document.createElement('div');
                propertyElement.classList.add('propertyelement');
            
                propertyElement.innerHTML = `
                    <img src="${API_URL}/uploads/${property.photo_url}" alt="${property.property_name}">
                    <p>${property.property_name}</p>
                    <p>Precio: ${property.price}</p>
                    <p>${isAvailable(property.available)}</p>
                    <a href="edit-property.html?id=${property.propertie_id}">Gestionar mi inmueble</a>
                `;
            
                container.appendChild(propertyElement);
                counter++;
            });
            checkIfIsEmpty();
        } else {
            const errorData = await response.json();
            console.error('Error en la solicitud:', errorData);
            checkIfIsEmpty();
        }
    } catch (error) {
        console.error('Error al realizar la solicitud:', error);
        checkIfIsEmpty();
    }
}


function checkIfIsEmpty(){
    if(counter == 0){
        document.getElementById("noProperties").classList.remove("inactive");
    }
}
checkAPI();

