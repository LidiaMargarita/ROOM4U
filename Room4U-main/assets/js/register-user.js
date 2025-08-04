function canAccess(){
  if (isLogged) {
    alert("Solo puedes entrar a esta pagina si aun no estas logueado");
    window.location.href = 'index.html'
  }
}

canAccess();

const register = document.getElementById('register');
const messageDiv = document.getElementById('message');

// Obtener la lista de escuelas al cargar la página
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch(API_URL + '/schoolslist');
    const schools = await response.json();

    // Poblar la lista desplegable
    const selectElement = document.getElementById('schoolSelect');
    schools.forEach(school => {
      const option = document.createElement('option');
      option.value = school.school_id; // ID como valor
      option.textContent = school.school_name; // Nombre visible
      selectElement.appendChild(option);
    });
  } catch (error) {
    console.error('Error al obtener las escuelas:', error);
  }
});

register.addEventListener('click', async (event) => {
  event.preventDefault();

  document.querySelectorAll('.error-message').forEach(div => {
    div.textContent = '';
    div.style.display = 'none'; // Ocultar el cuadro de error
});


  let hasError = false;
  const name = document.getElementById('name').value;
  const lastname = document.getElementById('lastname').value;
  const phonenumber = document.getElementById('phonenumber').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const userSchoolId = document.getElementById('schoolSelect').value;

  if (!name) {
    document.getElementById('name-error').textContent = 'El nombre es obligatorio.';
    document.getElementById('name-error').style.display = 'block';
    hasError = true;
  }

  if (!lastname) {
    document.getElementById('lastname-error').textContent = 'El apellido es obligatorio.';
    document.getElementById('lastname-error').style.display = 'block';
    hasError = true;
  }

  const phoneRegex = /^[0-9]{10}$/; // Ejemplo: solo números y 10 dígitos
  if (!phoneRegex.test(phonenumber)) {
    document.getElementById('phonenumber-error').textContent = 'El número de teléfono debe tener 10 dígitos.';
    document.getElementById('phonenumber-error').style.display = 'block';
    hasError = true;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Validación básica de email
  if (!emailRegex.test(email)) {
    document.getElementById('email-error').textContent = 'Por favor, ingresa un correo electrónico válido.';
    document.getElementById('email-error').style.display = 'block';
    hasError = true;
  }

  if (password.length < 8) {
    document.getElementById('password-error').textContent = 'La contraseña debe tener al menos 8 caracteres.';
    document.getElementById('password-error').style.display = 'block';
    hasError = true;
  }

  if (schoolSelect.value === "") {
    document.getElementById('school-error').textContent = 'Debes seleccionar una institución educativa.';
    document.getElementById('school-error').style.display = 'block';
    hasError = true;
  }

  if (hasError) {
    return;
  }

  try {
    const response = await fetch(API_URL + '/register-student', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, phonenumber, name, lastname, password, userSchoolId })
    });
    const data = await response.json();

    if (response.ok) {
      messageDiv.textContent = 'Usuario registrado exitosamente';
      messageDiv.style.color = 'green';
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 2000);
    } else {
      messageDiv.textContent = data.message;
      messageDiv.style.color = 'red';
    }
  } catch (error) {
    console.error('Error:', error);
    messageDiv.textContent = 'Error de conexión';
  }
});
