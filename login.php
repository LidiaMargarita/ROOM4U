<?php
require_once './config/conexion.php';

// Obtener datos enviados desde el formulario
$email = $_POST['email'];
$password = $_POST['password'];

// Consultar si existe el usuario
$query = "SELECT * FROM usuarios WHERE email = ? AND password = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("ss", $email, $password);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    // Iniciar sesión
    session_start();
    $user = $result->fetch_assoc();
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['user_type'] = $user['tipo'];

    // Redirigir al usuario según su tipo
    if ($user['tipo'] === 'propietario') {
        header("Location: mis-inmuebles/index.html");
    } else {
        header("Location: favoritos/index.html");
    }
} else {
    echo "Credenciales incorrectas. Intenta nuevamente.";
}

$stmt->close();
$conn->close();
?>