if(isLogged){
  alert("Solo puedes entrar a esta pagina si aun no estas logueado");
  window.location.href = 'index.html'
}

const loginButton = document.getElementById('login');
const messageDiv = document.getElementById('message');

loginButton.addEventListener('click', async (event) => {
  event.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;


  try {
    const response = await fetch(API_URL+'/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem('token', data.token);
      messageDiv.textContent = 'Inicio de sesión exitoso';
      messageDiv.style.color = 'green';
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1000);

      const protectedResponse = await fetch(API_URL+'/protected', {
        headers: { 'Authorization': data.token }
      });
      const protectedData = await protectedResponse.json();
      console.log(protectedData);
    } else {
      messageDiv.textContent = data.message;
      messageDiv.style.color = 'red';
    }
  } catch (error) {
    console.error('Error:', error);
    messageDiv.textContent = 'Error de conexión';
  }
});
