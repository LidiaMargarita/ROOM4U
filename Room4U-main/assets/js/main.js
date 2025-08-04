let token = localStorage.getItem('token');
let isLogged = false;
const API_URL = "https://room4u-api.carlosernestoem.live";
let notificationCounter = 0;


// Verificar si el token existe
if (token) {
    isLogged = true;
}

function mustBeLogin(){
    if(!isLogged){
        alert("Para entrar en esta pagina necesitas estar logueado");
        window.location.href = 'login.html';  
    }
}

let userType;
let user_id;

async function fetchUserType() {
    try {
        const response = await fetch(`${API_URL}/getusertype`, {
            method: 'GET',
            headers: {
                authorization: token
            }
        });

        if (response.ok) {
            const data = await response.json();
            userType = data.user_type_id; // Asignar el valor
            user_id = data.user_id;

            if(userType == 1){
                //estudiante
                fetchContactNotifications();
            }else if(userType == 2){
                //owner
                getOwnerNotifications();
            }

        } else {
            const errorData = await response.json();
            console.error('Error en la solicitud:', errorData);
        }
    } catch (error) {
        console.error('Error al realizar la solicitud:', error);
    }
}



const menulogin = document.querySelector("#menu-login");
const menupublish = document.querySelector("#menu-publish");
const menufavorites = document.querySelector("#menu-favorites");
const menumyproperties = document.querySelector("#menu-my-properties");
const menulogout = document.getElementById("menu-logout");
const notificationItem = document.querySelector("#notification");
const notificationContainer = document.querySelector("#notificationContainer");

menulogin.addEventListener("click", function() {
    if(!isLogged){
        window.location.href = 'login.html';  
    }
});

menupublish.addEventListener("click", function() {
    if(isLogged){
        if(userType == 2){
            window.location.href = 'publish.html';
        }else{
            alert("Solo los dueños pueden publicar");
        }
    }else{
        window.location.href = 'login.html';
    }
});

menufavorites.addEventListener("click", function() {
    if(isLogged){
        if(userType == 1){
            window.location.href = 'favorites.html';
        }else{
            alert("Solo los estudiantes pueden acceder a favoritos")
        }
    }else{
        window.location.href = 'login.html'; 
    }
});

menumyproperties.addEventListener("click", function() {
    if(isLogged){
        if(userType == 2){
            window.location.href = 'my-properties.html';
        }else{
            alert("Solo los dueños pueden acceder a favoritos")
        }
    }else{
        window.location.href = 'login.html'; 
    }
});

menulogout.addEventListener("click", function() {
    if(isLogged){
        logout();
    }
});

notificationItem.addEventListener("click", function() {
    navbarlist.classList.add("inactive");
    toggleNotifications();
});

function toggleNotifications(){
    if(notificationContainer.classList.contains("inactive")){
        notificationContainer.classList.remove("inactive");
    }else{
        notificationContainer.classList.add("inactive");
    }
}

async function modifyMenu() {
    if(isLogged){
        notificationItem.classList.remove("inactive");
        menulogout.classList.remove("inactive");
        menulogin.classList.add("inactive");
        if(userType == 2){
            //owner
            //hide favorites
            menufavorites.classList.add("inactive");
            menumyproperties.classList.remove("inactive")
        }else {
            //student
            menupublish.classList.add("inactive");
        }
    }
      
}

const navbar = document.querySelector("#nav-bar");
const navbarlist = document.querySelector("#nav-bar-list");

navbar.addEventListener("click", function() {
    notificationContainer.classList.add("inactive");
    toggleMenu();
});

function toggleMenu(){
    if(navbarlist.classList.contains("inactive")){
        navbarlist.classList.remove("inactive");
    }else{
        navbarlist.classList.add("inactive");
    }
}


  function parseJwt(token) {
    const base64Url = token.split('.')[1]; // Toma el payload del JWT
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload); // Devuelve el payload como un objeto
  }
  
  function isTokenExpired(token) {
    try {
      const { exp } = parseJwt(token); // Decodifica el token
      const currentTime = Math.floor(Date.now() / 1000); // Tiempo actual en segundos
      return exp < currentTime; // Devuelve true si el token ya expiró
    } catch (error) {
      console.error("Error al verificar el token", error);
      return true; // Si algo falla, considera el token como expirado
    }
  }

  function handleToken() {
    
    const token = localStorage.getItem("token"); // Obtén el token del almacenamiento local

    if (!token) {
        return;
    }

    if (isTokenExpired(token)) {
        logout();
    }
  }
  
  
function logout(){
    localStorage.removeItem("token"); // Elimina el token
    localStorage.removeItem("rating");
    window.location.href = 'index.html';
}

async function main() {
    handleToken();
    token = localStorage.getItem('token');
    if(token){
        await fetchUserType();
        modifyMenu();
    }
}


async function fetchContactNotifications() {
    try {
        const response = await fetch(`${API_URL}/getcontactnotifications`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': token
            }
        });

        if (response.ok) {
            const data = await response.json();
            const container = document.getElementById("notificationContainer");

            data.forEach(({ propertie_id, fullname }) => {
                createNotification("details",propertie_id,`El propietario ${fullname} se contactara contigo en breve`);
            });
        }
        const response2 = await fetch(`${API_URL}/getpostrating`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': token
            }
        });

        if (response2.ok) {
            const data = await response2.json();
            const container = document.getElementById("notificationContainer");

            data.forEach(({ propertie_id, fullname }) => {
                createNotification("details",propertie_id,`El propietario ${fullname} te asigno como cliente. Ahora puedes comentar respecto al inmueble`);
            });
        }
        addDefaultNotifications();
    } catch (error) {
        console.error('Error al realizar la solicitud:', error);
    }
}


async function getOwnerNotifications() {
    try {
        const response = await fetch(`${API_URL}/getcontactownernotifications`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': token
            }
        });

        if (response.ok) {
            const data = await response.json();
            const container = document.getElementById("notificationContainer");

            data.forEach(({ propertie_id,fullname, phonenumber,email }) => {
                createNotification("edit",propertie_id,`<p>El estudiante ${fullname} esta interesado en tu inmueble. <br> CONTACTALO<br>Numero de celular: ${phonenumber}<br>Correo: ${email}</p>`);
            });
        } else {
            const errorData = await response.json();
            console.error('Error en la solicitud:', errorData.message);
        }
        addDefaultNotifications();
    } catch (error) {
        console.error('Error al realizar la solicitud:', error);
    }
}


main();

function createNotification(redirect,propertie_id, htmlText){
    const container = document.getElementById("notificationContainer");
    const link = document.createElement("a");
    if(propertie_id != -1){
        if(redirect == "details"){
            link.href = `property-details.html?id=${propertie_id}`;
        }else if (redirect == "edit"){
            link.href = `edit-property.html?id=${propertie_id}`;
        }
    }
    link.innerHTML = htmlText;
    container.appendChild(link);
    notificationCounter++;
}

function addDefaultNotifications(){
    if(notificationCounter > 0){
        //TODO change color to notification item
        
    }else if(notificationCounter === 0){
        if(userType == 1){
            //estudiante
            createNotification("",-1,"No tienes notificaciones disponibles");
        }else if(userType == 2){
            //owner
            createNotification("",-1,"No tienes notificaciones disponibles");
        }    
    }
}