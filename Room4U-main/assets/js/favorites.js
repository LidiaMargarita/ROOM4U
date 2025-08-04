function canAccess(){
    mustBeLogin();
    if(userType == 2){
        alert("Solo los estudiantes pueden acceder a esta pagina");
        window.location.href = 'index.html'
        return;
    }
}
  
canAccess();


const container = document.querySelector('#property-container');

async function checkAPI() {
    try {
        const response = await fetch(`${API_URL}/getmyfavorites`, {
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
                    <p>Alcaldía: ${property.alcaldia}</p>
                    <a href="property-details.html?id=${property.propertie_id}">Detalles</a>
                `;
            
                container.appendChild(propertyElement);
            });
        } else {
            const errorData = await response.json();
            console.error('Error en la solicitud:', errorData);
        }
    } catch (error) {
        console.error('Error al realizar la solicitud:', error);
    }
}

checkAPI();
