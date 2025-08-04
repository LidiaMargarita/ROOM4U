const search = document.querySelector("#search");
const filters = document.querySelector("#search-filters");

search.addEventListener("click", () => filters.classList.toggle("inactive"));

const slider = document.getElementById("slider");
const thumbMin = document.getElementById("thumbMin");
const thumbMax = document.getElementById("thumbMax");
const rangeFill = document.getElementById("rangeFill");
const minValueInput = document.getElementById("minValue");
const maxValueInput = document.getElementById("maxValue");

let min = 0, max = 80, step = 1, minPosition = 0, maxPosition = 100;

function updateSlider() {
    const minPercentage = ((minPosition - min) / (max - min)) * 100;
    const maxPercentage = ((maxPosition - min) / (max - min)) * 100;

    thumbMin.style.left = `${minPercentage}%`;
    thumbMax.style.left = `${maxPercentage}%`;
    rangeFill.style.left = `${minPercentage}%`;
    rangeFill.style.width = `${maxPercentage - minPercentage}%`;

    minValueInput.value = Math.round(minPosition);
    maxValueInput.value = Math.round(maxPosition);
}

function onDrag(e, isMin) {
    const rect = slider.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const percentage = Math.min(Math.max(offsetX / rect.width, 0), 1);
    const value = Math.round(min + percentage * (max - min));

    if (isMin) {
        minPosition = Math.min(value, maxPosition - step);
    } else {
        maxPosition = Math.max(value, minPosition + step);
    }
    updateSlider();
}

function updateFromInputs() {
    minPosition = Math.max(min, Math.min(parseInt(minValueInput.value) || min, maxPosition - step));
    maxPosition = Math.min(max, Math.max(parseInt(maxValueInput.value) || max, minPosition + step));
    updateSlider();
}

thumbMin.addEventListener("mousedown", () => {
    const onMouseMove = (e) => onDrag(e, true);
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", () => {
        document.removeEventListener("mousemove", onMouseMove);
    }, { once: true });
});

thumbMax.addEventListener("mousedown", () => {
    const onMouseMove = (e) => onDrag(e, false);
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", () => {
        document.removeEventListener("mousemove", onMouseMove);
    }, { once: true });
});

minValueInput.addEventListener("input", updateFromInputs);
maxValueInput.addEventListener("input", updateFromInputs);

const container = document.querySelector('#property-container');

async function checkAPI() {
    try {
        const response = await fetch(`${API_URL}/getallproperties`, {
            method: 'GET',
            headers: { authorization: token }
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
        }
    } catch (error) {
        console.error('Error al cargar propiedades:', error);
    }

    try {
        const priceResponse = await fetch(`${API_URL}/getmaxminprices`);
        if (priceResponse.ok) {
            const priceData = await priceResponse.json();
            max = priceData[0].max_price;
            maxPosition = max * 0.7;
            updateSlider();
        }
    } catch (error) {
        console.error('Error al cargar precios:', error);
    }
}

checkAPI();
updateSlider();

function getSelectedButtonsOfPropertyType() {
    const propertyTypeSelected = document.querySelectorAll('.property-type button');
    const selectedButtons = Array.from(propertyTypeSelected)
        .filter(button => button.classList.contains('selected'))
        .map(button => button.value); 
    return selectedButtons;
}


function getSelectedButtonsOfTownhall() {
    const placesSelected = document.querySelectorAll('.places button');
    const selectedButtons = Array.from(placesSelected)
        .filter(button => button.classList.contains('selected'))
        .map(button => button.value);
    return selectedButtons;
}


document.querySelector('.confirm-search button').addEventListener('click', () => {
    const selectedPropertyType = getSelectedButtonsOfPropertyType();
    const selectedPlaces = getSelectedButtonsOfTownhall();

    if(selectedPropertyType.length < 1){
        alert("Selecciona al menos un tipo de propiedad")
        return;
    }

    if(selectedPlaces.length < 1){
        alert("Selecciona al menos una alcaldia")
        return;
    }

    refreshFilters(selectedPropertyType,selectedPlaces);
    filters.classList.add("inactive")
});


//clear and add new properties with filter
async function refreshFilters(selectedPropertyType,selectedPlaces) {
    document.getElementById('property-container').innerHTML = '';
    try {
        const response = await fetch(`${API_URL}/getallproperties`, {
            method: 'GET',
            headers: { authorization: token }
        });

        if (response.ok) {
            const data = await response.json();
            data.forEach(property => {
                if(selectedPropertyType.includes(String(property.property_type)) && selectedPlaces.includes(String(property.townhall_id))){
                    if(property.price >= minValueInput.value && property.price <= maxValueInput.value){
                        const propertyElement = document.createElement('div');
                        propertyElement.classList.add('propertyelement');
                        propertyElement.innerHTML = `
                            <img src="${API_URL}/uploads/${property.photo_url}" alt="${property.property_name}">
                            <p>${property.property_name}</p>
                            <p>Precio: ${property.price}</p>
                            <p>Alcaldía: ${property.alcaldia}</p>
                            <a href="property-details.html?id=${property.propertie_id}">Detalles</a>
                        `;
                        container.appendChild(propertyElement)
                    }
                };
            });
        }
    } catch (error) {
        console.error('Error al cargar propiedades:', error);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    try {
      const response = await fetch(API_URL+'/gettypesofproperty');
      const propertytype = await response.json();
  
      // Poblar la lista desplegable
      const selectElement = document.getElementById('property_type');
      propertytype.forEach(property => {
        const button = document.createElement('button');
        button.value = property.property_id; // ID como valor
        button.textContent = property.property_name; // Nombre visible
        selectElement.appendChild(button);
      });
    } catch (error) {
      console.error('Error al obtener los tipos de propiedad:', error);
    }

    try {
        const response = await fetch(API_URL+'/gettownhalls');
        const townhalls = await response.json();
    
        // Poblar la lista desplegable
        const selectElement = document.getElementById('townhalls');
        townhalls.forEach(townhall => {
          const option = document.createElement('button');
          option.value = townhall.townhall_id; // ID como valor
          option.textContent = townhall.townhall_name; // Nombre visible
          selectElement.appendChild(option);
        });
      } catch (error) {
        console.error('Error al obtener las alcaldias:', error);
      }

    const filterButtons = document.querySelectorAll('.filter-buttons button');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Alterna la clase "selected" para cambiar el color
            button.classList.toggle('selected');
        });
    });

  });