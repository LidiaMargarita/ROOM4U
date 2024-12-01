const mysql = require('mysql');

// Configura la conexión
const conexion = mysql.createConnection({
    host: 'localhost',       // Cambia si usas otro host
    user: 'root',            // Tu usuario de MariaDB
    password: '',            // Tu contraseña de MariaDB
    database: 'room4u'       // El nombre de tu base de datos
});

// Conecta a la base de datos
conexion.connect((err) => {
    if (err) {
        console.error('Error conectando a la base de datos:', err);
        return;
    }
    console.log('Conexión exitosa a la base de datos.');
});

module.exports = conexion;