const urlParams = new URLSearchParams(window.location.search);
const propertie_id = urlParams.get('id'); // Obtiene el ID de la URL
let available = false;
let propertie_owner_id = -1;

const streetItem = document.getElementById("street");
const streetNumberItem = document.getElementById("streetnumber");
const streetPrivateNumberItem = document.getElementById("streetprivatenumber");
const cologneItem = document.getElementById("cologne");
const postalcodeItem = document.getElementById("postalcode");
const priceItem = document.getElementById("price");
const descriptionItem = document.getElementById("description");

const propertyTypeItem = document.getElementById("property_type");
const townhallsItem = document.getElementById("townhalls");


async function checkIfCanSee(){
    if (!user_id) {
        return;
    }

    mustBeLogin();

    if(userType == 1){
        alert("Esta pagina solo esta disponible para propietarios");
        window.location.href = 'index.html'
    }

    try {
        const response = await fetch(`${API_URL}/getgeneraldataofproperty/${propertie_id}`, {
            method: 'GET',
        });

        if (response.ok) {
            const data = await response.json();
            available = data.available;
            refreshPropertyStatus();
            propertie_owner_id = data.propertie_owner_id;
            descriptionItem.value = data.description;
            streetItem.value = data.street;
            streetNumberItem.value = data.street_number;
            streetPrivateNumberItem.value = data.street_private_number;
            cologneItem.value = data.cologne;
            postalcodeItem.value = data.postal_code;
            priceItem.value = data.price;
            propertyTypeItem.value = data.property_type;
            townhallsItem.value = data.townhall_id;
        } else {
            const errorData = await response.json();
            console.error('Error en la solicitud:', errorData);
        }
    } catch (error) {
        console.error('Error al realizar la solicitud:', error);
    }

    if(propertie_owner_id == -1 || propertie_owner_id != user_id){
        alert("No eres el dueño de este inmueble");
        window.location.href = 'index.html'
        return;
    }

    init();
}

checkIfCanSee();

async function init(){
    try {
        const response = await fetch(API_URL + '/getstudentinterested',{
          method: 'POST',
          headers: {
              authorization: token,
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({propertie_id})
        });
  
        const studentsinterested = await response.json();

        // Poblar la lista desplegable
        const clientList = document.getElementById('clientList');
        studentsinterested.forEach(student => {
          const option = document.createElement('option');
          option.value = student.user_id; // ID como valor
          option.textContent = student.fullName; // Nombre visible
          clientList.appendChild(option);
        });
      } catch (error) {
        console.error('Error al obtener las escuelas:', error);
      }
}

const setClient = document.getElementById("setClientButton");
const clientList = document.getElementById("clientList");
const busyButton = document.getElementById("busyButton");
const availableButton = document.getElementById("availableButton");
const deleteButton = document.getElementById("deleteButton");
const updateButton = document.getElementById("updateButton");

async function modifyStatusOfProperty(clearUsers, status, user_id) {
    try {
        const response = await fetch(API_URL + '/modifyStatusOfProperty',{
          method: 'POST',
          headers: {
              authorization: token,
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({clearUsers, status, user_id, propertie_id, propertie_owner_id})
        });
      } catch (error) {
        console.error('Error al actualizar el estado de la propiedad:', error);
      }
}

async function updateProperty() {
        const images = document.getElementById('images').files;

        if (!propertyTypeItem.value || !townhallsItem.value || !streetItem.value || !streetNumberItem.value || !cologneItem.value || !priceItem.value || !descriptionItem.value) {
          alert('Por favor, llena todos los campos.');
          return;
        }

        if (isNaN(priceItem.value) || priceItem.value <= 0) {
          alert("El precio debe ser positivo")
          return;
        }
        if (descriptionItem.value.length > 200 || descriptionItem.value.length == 0) {
          alert("La descripcion  es obligatoria y no puede tener mas de 200 caracteres")
          return;
        }

        if(postalcodeItem.value.length != 5 || postalcodeItem.value < 0){
          alert("El codigo postal tiene que ser de 5 numeros");
          return;
        }

        if (images.length < 5 || images.length > 10) {
            alert('Por favor, sube entre 5 y 10 imágenes.');
            return;
        }
        // Crear un objeto FormData para enviar imágenes y otros datos

        const formData = new FormData();
        formData.append('propertie_id', propertie_id);
        formData.append('property_type', propertyTypeItem.value);
        formData.append('townhall_id', townhallsItem.value);
        formData.append('description', descriptionItem.value);
        formData.append('street', streetItem.value);
        formData.append('street_number', streetNumberItem.value);
        formData.append('street_private_number', streetPrivateNumberItem.value || '1');
        formData.append('cologne', cologneItem.value);
        formData.append('postal_code',postalcodeItem.value);
        formData.append('price', priceItem.value);
      
        // Añadir imágenes al FormData
        for (let i = 0; i < images.length; i++) {
          formData.append('images', images[i]);
        }

    try {
        const response = await fetch(API_URL + '/updateProperty',{
          method: 'POST',
          headers: {
              authorization: token,
          },
          body: formData,
        });
        if(response.ok){
            alert("Se actualizaron los datos de tu propiedad con exito!");
        }else{
            alert("Ocurrio un error al actualizar los datos de la propiedad!");
        }
      } catch (error) {
        console.error('Error al actualizar el estado de la propiedad:', error);
        alert("Ocurrio un error al actualizar los datos de la propiedad!");
      }
}

setClient.addEventListener("click", async function() {
    if(clientList.classList.contains("inactive")){
        clientList.classList.remove("inactive");
    }else{
        const studentSelected = document.getElementById("clientList");
        if(studentSelected.value == 0){
            alert("Debes seleccionar un estudiante!")
            return;
        }
        modifyStatusOfProperty(true,false,studentSelected.value);
        available = false;
        refreshPropertyStatus();
        studentSelected.value = 0;
        //can generate a problem the favorites (?) idk, but i think no

        clientList.classList.add("inactive");
        //clear list of interested
        while (clientList.children.length > 1) {
            clientList.removeChild(clientList.lastChild);
          }          
    }
});//function modifyStatusOfProperty(clearUsers, status, user_id, propertie_id)

busyButton.addEventListener('click', async function() {
    modifyStatusOfProperty(true,false,-1);
    available = false;
    refreshPropertyStatus();
});

availableButton.addEventListener('click', async function() {
    modifyStatusOfProperty(false,true,-1);
    available = true;
    refreshPropertyStatus();
});

deleteButton.addEventListener('click', async function() {
  try {
    const response = await fetch(API_URL + '/deleteProperty',{
      method: 'POST',
      headers: {
          authorization: token,
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({propertie_id})
    });
    if(response.ok){
      window.location.href = "my-properties.html";
  }else{
    alert("Ocurrio un error al eliminar la propiedad!");
  }
  } catch (error) {
    console.error('Error al eliminar la propiedad:', error);
  }
});

updateButton.addEventListener('click', async function() {
    updateProperty();
});


function refreshPropertyStatus(){
    if(available){
        availableButton.classList.add("inactive");
        busyButton.classList.remove("inactive");
        setClient.classList.remove("inactive");
    }else{
        availableButton.classList.remove("inactive");
        busyButton.classList.add("inactive")
        setClient.classList.add("inactive");
    }    
    clientList.classList.add("inactive");
}

const interval = setInterval(async () => {
    if (user_id) {
        clearInterval(interval); // Detenemos el intervalo cuando user_id está listo
        await checkIfCanSee();   // Ejecutamos el método
    } else {
        console.log("Esperando inicialización de user_id...");
    }
}, 500); // Reintenta cada 500 ms

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