Para instalar este servidor backend de Room4U se debera hacer lo siguiente:

Es necesario tener instalado Node.JS v22.11.0 o superior
Es necesario tener montadaba una base de datos MariaDB o MySQL, se uso esta version para el desarrollo:
mysql  Ver 15.1 Distrib 10.11.8-MariaDB, for debian-linux-gnu (x86_64) using  EditLine wrapper


Se debera entrar al archivo db.js y asignar las credenciales y nombre de la base de datos que usara.

Ahora se crearan las tablas SQL, que se encuentran dentro del archivo database.sql
Se deberan crear usando esos comandos

Finalmente para correr el servidor se tendra que ejecutar el comando:
node server.js