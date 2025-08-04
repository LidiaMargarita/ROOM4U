const urlParams = new URLSearchParams(window.location.search);
const propertie_id = urlParams.get('id'); // Obtiene el ID de la URL
let isFavoriteLocal = false;
let userHasRented = false;
let rented_id = 0;

const commentSection = document.getElementById("postComment");

async function checkAPI() {
    try {
        const response = await fetch(`${API_URL}/getdetailsofproperty/${propertie_id}`, {
            method: 'GET',
            headers: {
                authorization: token
            }
        });

        if (response.ok) {
            const data = await response.json();

            if (data.length > 0) {
                const property = data[0];

                // Actualizar datos en HTML
                document.querySelector("#description").innerText = property.description || "No hay descripción.";
                document.querySelector("#price").innerText = `$${property.price.toLocaleString()}`;
                const streetpn = (property.street_private_number == 1 ? "" : "Numero Privado: "+property.street_private_number);
                document.querySelector(".dataContainer").insertAdjacentHTML('afterbegin', `
                    <p>Tipo de Propiedad: ${property.property_name}</p>
                    <p>Colonia: ${property.cologne}</p>
                    <p>Código Postal: ${property.postal_code}</p>
                    <p>Calle: ${property.street} Numero: ${property.street_number || ''} ${streetpn}</p>
                    <p>Alcaldía: ${property.townhall_name}</p>

                `);

                // Crear Slider
                const photos = property.photos.split(',');
                const imageContainer = document.querySelector('.imageContainer');
                let currentIndex = 0;

                // Insertar imágenes dinámicamente
                imageContainer.innerHTML = photos.map((photo, index) => `
                    <img src="${API_URL}/uploads/${photo}" style="transform: translateX(${index * 100}%)">
                `).join('');

                // Añadir botones de navegación
                imageContainer.innerHTML += `
                    <button class="prev">&lt;</button>
                    <button class="next">&gt;</button>
                `;

                // Navegación del slider
                const prevButton = document.querySelector('.prev');
                const nextButton = document.querySelector('.next');
                const images = document.querySelectorAll('.imageContainer img');

                function updateSlider(index) {
                    images.forEach((img, i) => {
                        img.style.transform = `translateX(${(i - index) * 100}%)`;
                    });
                }

                prevButton.addEventListener('click', () => {
                    currentIndex = (currentIndex - 1 + photos.length) % photos.length;
                    updateSlider(currentIndex);
                });

                nextButton.addEventListener('click', () => {
                    currentIndex = (currentIndex + 1) % photos.length;
                    updateSlider(currentIndex);
                });

            } else {
                console.error('No se encontraron datos para esta propiedad.');
                alert("Esta propiedad no existe!");
                window.location.href = 'index.html';
            }
        } else {
            const errorData = await response.json();
            console.error('Error en la solicitud:', errorData);
        }
    } catch (error) {
        console.error('Error al realizar la solicitud:', error);
    }
    if(isLogged){
        checkIfFavorite();
        getIfTheUserHasRented();
    }
}

checkAPI();


const contactButton = document.querySelector("#contactButton");

contactButton.addEventListener("click", function() {
    if(!isLogged){
        alert("Para hacer esto necesitas estar logueado!");
        window.location.href = 'login.html';  
    }else{
        if(userType != 1){
            alert("Solo los estudiantes pueden contactar!");
            return;
        }
    }
    saveContact(propertie_id);
});

const opencommentbutton = document.querySelector("#opencommentbutton");

opencommentbutton.addEventListener("click", async() => {
    if(commentSection.classList.contains("inactive")){
        commentSection.classList.remove("inactive");
    }else{
        commentSection.classList.add("inactive");
    }
});


const commentbutton = document.querySelector("#commentbutton");
commentbutton.addEventListener("click", async() => {
    if(!isLogged){
        alert("Para hacer esto necesitas estar logueado!");
        window.location.href = 'login.html';  
    }else{
        if(userType != 1){
            alert("Solo los estudiantes pueden comentar!");
            return;
        }
        if(!userHasRented){
            alert("No puedes comentar porque no has rentado");
            return;
        }

        let comment = document.getElementById('commentinput').value;


        if (!comment.trim()) {
            alert('El comentario no puede estar vacío.');
            return;
          }
      
        if(rating == 0){
            alert("Selecciona al menos una estrella!")
            return;
        }

          try {
            const response = await fetch(`${API_URL}/addComment`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                authorization: token
              },
              body: JSON.stringify({rented_id, propertie_id, comment, rating }),
            });
      
            const result = await response.json();
            if (response.ok) {
                localStorage.removeItem("rating");
                window.location.reload();
            } else {
              alert(result.message || 'Error al enviar el comentario.');
            }
          } catch (error) {
            console.error('Error:', error);
            alert('Error interno del servidor.');
          }
    }
});

document.getElementById('favoriteButton').addEventListener('click', async function () {
    if(!isLogged){
        alert("Para hacer esto necesitas estar logueado!");
        window.location.href = 'login.html';  
    }else{
        if(userType != 1){
            alert("Solo los estudiantes pueden añadir a favoritos!");
            return;
        }
    }
    const button = this;

    const heartIcon = button.querySelector('.heart-icon');
    try {
        // Realiza el POST para cambiar el estado
        const response = await fetch(`${API_URL}/setFavorite`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: token
            },
            body: JSON.stringify({ propertie_id, active: !isFavoriteLocal })
        });
        if (response.ok) {
            // Actualiza el atributo y el color del botón\
            isFavoriteLocal = !isFavoriteLocal;
            button.setAttribute('data-favorite', (isFavoriteLocal));
            heartIcon.setAttribute('stroke', isFavoriteLocal ? 'red' : 'grey'); // Cambia el color del borde        } else {
        }
    } catch (error) {
        console.error('Error al realizar la solicitud:', error);
    }
});

async function saveContact(propertie_id) {
    try {
        const response = await fetch(`${API_URL}/setContact`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
            body: JSON.stringify({ propertie_id, active: 1 })
        });

        const data = await response.json();

        if (response.ok) {
            console.log(data.message);
            alert("El propietario se contactará contigo lo más pronto posible");
        } else {
            console.error(data.message || 'Error al guardar el contacto.');
        }
    } catch (error) {
        console.error('Error al realizar el POST:', error);
    }
}


async function checkIfFavorite() {
    try {
        const response = await fetch(`${API_URL}/getmyfavorites`, {
            method: 'GET',
            headers: {
                Authorization: token
            }
        });

        if (response.ok) {
            const favorites = await response.json(); // Lista de favoritos del usuario
            const isFavorite = favorites.some(fav => fav.propertie_id == propertie_id); // Verifica si el inmueble está en la lista

            const button = document.getElementById('favoriteButton');
            if (isFavorite) {
                isFavoriteLocal = true;
                button.setAttribute('data-favorite', 'true');
                button.querySelector('.heart-icon').style.color = 'red';
            }
        }
    } catch (error) {
        console.error('Error al cargar favoritos:', error);
    }
}

async function getIfTheUserHasRented() {
    try {
        const response = await fetch(`${API_URL}/userHasRentedProperty`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
            body: JSON.stringify({ propertie_id})
        });
        if (response.ok) {
            const result = await response.json();
            if(result.length > 0){
                result.forEach(rented => {
                    if(rented.calified != 1){
                        userHasRented = true;
                        rented_id = rented.rented_id;
                        if(userHasRented){
                            opencommentbutton.classList.remove("inactive");
                        }
                    }
                });
            }
        } else {
            console.error('No se pudo cargar si ha rentado.');
        }
    } catch (error) {
        console.error('Error al cargar favoritos:', error);
    }
}

async function fetchComments() {
    try {
        const response = await fetch(`${API_URL}/getcommentsofproperty/${propertie_id}`);
        const commentsData = await response.json();
        
        if (commentsData.length > 0) {
            commentsData.forEach(comment => {
                addCommmentToHTML(comment.fullname, comment.comment);
            });
        }

        const response2 = await fetch(`${API_URL}/getrateofproperty/${propertie_id}`);
        const rateData = await response2.json();
        const rate = rateData[0]; 
        const totalRateCount = document.getElementById("totalRates");
        if (commentsData.length > 0) {
            setStarRatingValue(rate.total_ratings_value/rate.total_ratings_count);//total_ratings_count
            totalRateCount.innerText = "("+rate.total_ratings_count+")";

        }
    } catch (error) {
        console.error('Error al obtener los comentarios:', error);
    }
}

function addCommmentToHTML(fullnameText, comment){
    const commentsContainer = document.getElementById('commentsContainer');
    const commentElement = document.createElement('div');
    commentElement.classList.add('comment');
    
    // Crear el texto del comentario
    const fullname = document.createElement('p');
    fullname.textContent = fullnameText+":";
    fullname.classList.add("commentName");

    const commentText = document.createElement('p');
    commentText.textContent = comment;

    // Añadir los elementos al contenedor del comentario
    commentElement.appendChild(fullname);
    commentElement.appendChild(commentText);
    commentsContainer.appendChild(commentElement);

}

// Llamar la función para obtener y mostrar los comentarios
fetchComments();


let rating = 0;

const stars = document.querySelectorAll('#star-rating .star');
stars.forEach(star => {
  star.addEventListener('click', () => {
    stars.forEach(s => s.classList.remove('selected'));
    rating = star.getAttribute('data-value'); // Guarda el valor
    localStorage.setItem("rating", rating);
    for (let i = 0; i < rating; i++) {
      stars[i].classList.add('selected');
    }
  });
});

function setStarRatingValue(value) {
    const allRates = document.querySelectorAll('.rate');
    
    // Limitar el valor entre 0 y 5
    value = Math.max(0, Math.min(5, value));
  
    allRates.forEach((rate, index) => {
      // Limpiar las clases previas
      rate.classList.remove('filled', 'empty', 'partial');
  
      const starValue = index + 1;
  
      // Para cada estrella, decide si está llena, vacía o parcialmente llena
      if (starValue <= value) {
        // Estrella llena
        rate.classList.add('filled');
      } else if (starValue - 1 < value && starValue > value) {
        // Estrella parcialmente llena (maneja decimales)
        const fractionalPart = value - Math.floor(value); // Parte decimal de la calificación
        const threshold = fractionalPart * 100; // Convertir el decimal a porcentaje
  
        // Esto asegura que una estrella parcial se llene según el valor decimal
        if (threshold > 0) {
          rate.classList.add('partial');
        }
      } else {
        // Estrella vacía
        rate.classList.add('empty');
      }
    });
  }

  const commentInput = document.getElementById('commentinput');
  const commentButton = document.getElementById('commentbutton');

  // Escuchar cambios en el input
  commentInput.addEventListener('input', () => {
      if (commentInput.value.trim().length > 0) {
          commentButton.disabled = false; // Habilitar el botón
      } else {
          commentButton.disabled = true; // Deshabilitar el botón
      }
  });

  window.onload = function() {
    const ratingLocal = localStorage.getItem("rating");
    const starsRating = document.querySelectorAll('#star-rating .star');
    for (let i = 0; i < ratingLocal; i++) {
        starsRating[i].classList.add('selected');
    }
    rating = ratingLocal;
};