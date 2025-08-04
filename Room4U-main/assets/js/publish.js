function canAccess(){
  mustBeLogin();
  if(userType == 1){
      alert("Esta pagina solo esta disponible para propietarios");
      window.location.href = 'index.html'
  }
}

canAccess();

document.addEventListener('DOMContentLoaded', async () => {
    try {
      const response = await fetch(API_URL+'/gettypesofproperty');
      const propertytype = await response.json();
  
      // Poblar la lista desplegable
      const selectElement = document.getElementById('property_type');
      propertytype.forEach(property => {
        const option = document.createElement('option');
        option.value = property.property_id; // ID como valor
        option.textContent = property.property_name; // Nombre visible
        selectElement.appendChild(option);
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
          const option = document.createElement('option');
          option.value = townhall.townhall_id; // ID como valor
          option.textContent = townhall.townhall_name; // Nombre visible
          selectElement.appendChild(option);
        });
      } catch (error) {
        console.error('Error al obtener las alcaldias:', error);
      }
  });

const uploadButton = document.getElementById("upload");
const alertContainer = document.getElementById("alertContainer");
const confirmalert = document.getElementById("confirmalert");
const noconfirmalert = document.getElementById("noconfirmalert");

let formData = new FormData();

uploadButton.addEventListener('click', async (event) => {
  event.preventDefault();
  document.querySelectorAll('.error-message').forEach(div => {
      div.textContent = '';
      div.style.display = 'none'; // Ocultar el cuadro de error
  });
    let hasError = false;

    const propertyType = document.getElementById('property_type').value;
    const townhall = document.getElementById('townhalls').value;
    const street = document.querySelector('input[placeholder="Calle"]').value;
    const streetNumber = document.querySelector('input[placeholder="Numero Exterior"]').value;
    const streetPrivateNumber = document.querySelector('input[placeholder="Numero Interior"]').value;
    const cologne = document.querySelector('input[placeholder="Colonia"]').value;
    const postal_code = document.getElementById('postal_code').value;
    const price = parseFloat(document.querySelector('input[placeholder="Precio"]').value.trim());
    const description = document.querySelector('input[placeholder="Maximo 200 caracteres"]').value;
    const images = document.getElementById('images').files;
  
    if (!street || street.length > 50) {
      document.getElementById('street-error').textContent = 'La calle debe tener máximo 50 caracteres.';
      document.getElementById('street-error').style.display = 'block';
      hasError = true;
    }
    if (!/^\d+$/.test(streetNumber)) {
      document.getElementById('streetNumber-error').textContent = 'El número exterior es obligatorio y debe ser numérico.';
      document.getElementById('streetNumber-error').style.display = 'block';
      hasError = true;
    }
  
    if (!cologne || cologne.length > 50) {
      document.getElementById('cologne-error').textContent = 'La colonia es obligatoria y debe tener máximo 50 caracteres.';
      document.getElementById('cologne-error').style.display = 'block';
      hasError = true;
    }
    const postalRegex = /^[0-9]{5}$/; 
    if (!postalRegex.test(postal_code)) {
      document.getElementById('postal_code-error').textContent = 'El código postal es obligatorio y debe tener 5 números.';
      document.getElementById('postal_code-error').style.display = 'block';
      hasError = true;
    }
    if (isNaN(price) || price <= 0) {
      document.getElementById('price-error').textContent = 'El precio debe ser un número positivo.';
      document.getElementById('price-error').style.display = 'block';
      hasError = true;
    } else {
      document.getElementById('price-error').textContent = '';
      document.getElementById('price-error').style.display = 'none';
    }
    if (!description || description.length > 200) {
      document.getElementById('description-error').textContent = 'La descripción es obligatoria y debe tener máximo 200 caracteres.';
      document.getElementById('description-error').style.display = 'block';
      hasError = true;
    }

    if (hasError) {
      return;
    }

    // Validar mínimo y máximo de imágenes
    if (images.length < 5 || images.length > 10) {
      alert('Por favor, sube entre 5 y 10 imágenes.');
      return;
    }
  
    // Validar campos obligatorios
    if (!propertyType || !townhall || !street || !streetNumber || !cologne || !price || !description) {
      alert('Por favor, llena todos los campos.');
      return;
    }
  
    // Crear un objeto FormData para enviar imágenes y otros datos
    formData = new FormData();
    formData.append('property_type', propertyType);
    formData.append('townhall_id', townhall);
    formData.append('street', street);
    formData.append('street_number', streetNumber);
    formData.append('street_private_number', streetPrivateNumber || '1');
    formData.append('cologne', cologne);
    formData.append('postal_code',postal_code);
    formData.append('price', price);
    formData.append('description', description);
    formData.append('propertie_owner_id', user_id);
  
    // Añadir imágenes al FormData
    for (let i = 0; i < images.length; i++) {
      formData.append('images', images[i]);
    }

    alertContainer.classList.remove("inactive");
});

confirmalert.addEventListener('click', async (event) => {
  alertContainer.classList.add("inactive");
  try {
    const response = await fetch(API_URL+'/register-property', {
      method: 'POST',
      headers: {
        authorization: token
      },
      body: formData,
    });

    const result = await response.json();
    if (response.ok) {
      alert("Se ha registrado tu propiedad");
      window.location.href = "my-properties.html"
    } else {
      alert(`Error: ${result.message}`);
    }
  } catch (error) {
    console.error('Error al enviar datos:', error);
    alert('Error al registrar la propiedad.');
  }
});

noconfirmalert.addEventListener('click', async (event) => {
  if(alertContainer.classList.add("inactive"));
});

  document.querySelector('#upsload').addEventListener('click', async (event) => {
  
  });
  