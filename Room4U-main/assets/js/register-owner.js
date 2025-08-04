function canAccess(){
  if (isLogged) {
    alert("Solo puedes entrar a esta pagina si aun no estas logueado");
    window.location.href = 'index.html'
  }
}

canAccess();


const register = document.getElementById('register');
const messageDiv = document.getElementById('message');

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

  if (hasError) {
    return;
  }

  try {
    const response = await fetch(API_URL + '/register-owner', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, phonenumber, name, lastname, password })
    });

    const data = await response.json();

    if (response.ok) {
      document.getElementById('message').textContent = 'Usuario registrado exitosamente';
      document.getElementById('message').style.color = 'green';
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 2000);
    } else {
      document.getElementById('message').textContent = data.message;
      document.getElementById('message').style.color = 'red';
    }
  } catch (error) {
    console.error('Error:', error);
    document.getElementById('message').textContent = 'Error de conexión';
  }
});
