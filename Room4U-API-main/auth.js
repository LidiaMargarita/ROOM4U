const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./db');

const SECRET_KEY = 'mi_clave_secreta';

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const user = rows[0];
    const isMatch = bcrypt.compareSync(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    const token = jwt.sign({ userId: user.user_id }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

exports.registerStudent = async (req, res) => {
  const { email, phonenumber, name, lastname, password, userSchoolId } = req.body;

    if (!email || !phonenumber || !name || !lastname || !password || !userSchoolId){
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }
  
    try {
      const [existingUser] = await db.execute('SELECT user_id FROM users WHERE email = ?', [email]);
  
      if (existingUser.length > 0) {
        return res.status(400).json({ message: 'El correo electrónico ya está registrado' });
      }
  
      const hashedPassword = bcrypt.hashSync(password, 10);
  
      const [insertResult] = await db.execute(
        'INSERT INTO users (user_type_id, email, phonenumber, name, lastname, password) VALUES (?, ?, ?, ?, ?, ?)', 
        [
          1, // user type 1 = student
          email,
          phonenumber,
          name,
          lastname,
          hashedPassword
        ]
      );
  
      const userId = insertResult.insertId; // Obtén el ID del usuario insertado

      await db.execute(
        'INSERT INTO user_schools (user_id, school_id) VALUES (?, ?)', 
        [
          userId,
          userSchoolId
        ]
      );

      res.status(201).json({ message: 'Usuario registrado exitosamente' });
    } catch (error) {
      console.error('Error en registro:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  };

  exports.registerOwner = async (req, res) => {
    const { email, phonenumber, name, lastname, password } = req.body;

    if (!email || !phonenumber || !name || !lastname || !password) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }
  
    try {
      const [existingUser] = await db.execute('SELECT user_id FROM users WHERE email = ?', [email]);
  
      if (existingUser.length > 0) {
        return res.status(400).json({ message: 'El correo electrónico ya está registrado' });
      }
  
      const hashedPassword = bcrypt.hashSync(password, 10);
  
      await db.execute(
        'INSERT INTO users (user_type_id, email, phonenumber, name, lastname, password) VALUES (?, ?, ?, ?, ?, ?)', 
        [
          2, // user type 2 = owner
          email, 
          phonenumber,
          name,
          lastname,
          hashedPassword
        ]
      );
  
      res.status(201).json({ message: 'Usuario registrado exitosamente' });
    } catch (error) {
      console.error('Error en registro:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  };

  exports.setFavorite = async (req, res) => {
    const { propertie_id, active} = req.body;
    const userId = req.userId;

    if (!propertie_id) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }
  
    try {
      const [existingFavorite] = await db.execute('SELECT * FROM favorites WHERE user_id = ? and propertie_id = ?', [userId,propertie_id]);
  
      if (existingFavorite.length > 0) {
        //ya existe el favorito
        if(!active){
          await db.execute("DELETE FROM favorites WHERE user_id = ? and propertie_id = ?",[userId, propertie_id])
        }
      }else{
        await db.execute("INSERT INTO favorites (user_id, propertie_id) VALUES (?, ?)",[userId, propertie_id])
      }
  
      res.status(201).json({ message: 'Favorito registrado exitosamente' });
    } catch (error) {
      console.error('Error en favorito:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  };

  exports.addComment = async (req, res) => {
    const { rented_id, propertie_id, comment, rating} = req.body;
    const userId = req.userId;

    if (propertie_id == null || rented_id  == null || comment == null  || rating == 0) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }
  
    try {
      await db.execute("INSERT INTO comments (rented_id, comment) VALUES (?,?)",
        [rented_id, comment]
      );
      await db.execute("INSERT INTO ratings (rented_id, rating) VALUES (?, ?)",
        [rented_id,rating]
      );
      await db.execute("UPDATE users_rented SET calified = true WHERE rented_id = "+rented_id);
      res.status(201).json({ message: 'Comentario registrado exitosamente' });
    } catch (error) {
      console.error('Error en registrar comentario:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  };

  exports.userHasRentedProperty = async (req, res) => {
    const { propertie_id} = req.body;
    const userId = req.userId;
    if (!propertie_id) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }    try {
      const [rows] = await db.execute("SELECT * FROM users_rented WHERE user_id = ? and propertie_id = ?",
        [userId, propertie_id]
      )

      res.status(201).json(rows);
    } catch (error) {
      console.error('Error en favorito:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  };

  exports.getmyfavorites = async (req, res) => {
    try {
      const userId = req.userId;
  
      // Consulta para obtener las propiedades favoritasdel usuario
      const [rows] = await db.execute("SELECT properties.propertie_id, property_type.property_name, properties.price, town_hall.townhall_name AS alcaldia, photos.photo_url FROM favorites JOIN properties ON favorites.propertie_id = properties.propertie_id JOIN property_type ON properties.property_type = property_type.property_id JOIN town_hall ON properties.townhall_id = town_hall.townhall_id LEFT JOIN (SELECT propertie_id, photo_url FROM photos GROUP BY propertie_id) AS photos ON properties.propertie_id = photos.propertie_id WHERE favorites.user_id = ?",
      [userId]
      );
      
      if (rows.length === 0) {
        return res.status(404).json({ message: 'No hay propiedades favoritas' });
      }
      res.json(rows);
    } catch (error) {
      console.error('Error al obtener el perfil:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }  
  };

  exports.getcontactnotifications = async (req, res) => {
    try {
      const userId = req.userId;
  
      // Consulta para obtener los nombres de quien te contactara
      const [rows] = await db.execute("SELECT interested.propertie_id, CONCAT(users.name, ' ', users.lastname) AS fullname FROM interested JOIN properties ON interested.propertie_id = properties.propertie_id JOIN users ON properties.propertie_owner_id = users.user_id WHERE interested.user_id = ?",
      [userId]
      );
      
      if (rows.length === 0) {
        return res.status(404).json({ message: 'No hay nadie quien te contacte' });
      }
      res.json(rows);
    } catch (error) {
      console.error('Error al obtener el perfil:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }  
  };

  exports.getpostrating = async (req, res) => {
    try {
      const userId = req.userId;
  
      // Consulta para obtener a quien debes puntuar, cambiar esto, consulta mal
      const [rows] = await db.execute("SELECT p.propertie_id, CONCAT(u.name, ' ', u.lastname) AS fullname FROM properties p JOIN users u ON p.propertie_owner_id = u.user_id JOIN users_rented ur ON ur.propertie_id = p.propertie_id WHERE ur.calified = 0 AND ur.user_id = ?",
      [userId]
      );
      
      res.json(rows);
    } catch (error) {
      console.error('Error al obtener los post que debes puntuar:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }  
  };

  exports.getcontactownernotifications = async (req, res) => {
    try {
      const userId = req.userId;
  
      // Consulta para obtener a quien le interesa tu inmueble
      const [rows] = await db.execute("SELECT interested.propertie_id, CONCAT(users.name, ' ', users.lastname) AS fullname, users.phonenumber, users.email FROM interested JOIN users ON interested.user_id = users.user_id JOIN properties ON interested.propertie_id = properties.propertie_id WHERE properties.propertie_owner_id = ?",
      [userId]
      );
      
      if (rows.length === 0) {
        return res.status(404).json({ message: 'No hay nadie que le interesen tus inmuebles' });
      }
      res.json(rows);
    } catch (error) {
      console.error('Error al obtener el perfil:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }  
  };

  exports.setContact = async (req, res) => {
    const { propertie_id, active} = req.body;
    const userId = req.userId;

    if (!propertie_id || !active) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }
  
    try {
      const [existingFavorite] = await db.execute('SELECT * FROM interested WHERE user_id = ? and propertie_id = ?', [userId,propertie_id]);
  
      if (existingFavorite.length > 0) {
        if(!active){
          await db.execute("DELETE FROM interested WHERE user_id = ? and propertie_id = ?",[userId, propertie_id])
        }
      }else{
        await db.execute("INSERT INTO interested (user_id, propertie_id) VALUES (?, ?)",[userId, propertie_id])
      }
  
      res.status(201).json({ message: 'Se guardo el contacto exitosamente' });
    } catch (error) {
      console.error('Error en favorito:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  };

  exports.registerProperty = async (req, res) => {
    const {
      propertie_owner_id,
      property_type,
      townhall_id,
      description,
      street,
      street_number,
      street_private_number,
      cologne,
      postal_code,
      price,
    } = req.body;

    // Validación de campos
    if (
      !propertie_owner_id ||
      !property_type ||
      !townhall_id ||
      !description ||
      !street ||
      !street_number ||
      !cologne ||
      !price
    ) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }
  
    try {
      // Insertar la propiedad en la tabla `properties`
      const [result] = await db.execute(
        `INSERT INTO properties 
        (propertie_owner_id, property_type, townhall_id, description, street, street_number, street_private_number, cologne, postal_code, available, price) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          propertie_owner_id,
          property_type,
          townhall_id,
          description,
          street,
          street_number,
          street_private_number || 1,
          cologne,
          postal_code,
          true,
          price,
        ]
      );
      const propertyId = result.insertId;
  
      // Guardar las fotos si existen
      if (req.files && req.files.length > 0) {
        const imagePromises = req.files.map((file) =>
          db.execute(
            `INSERT INTO photos (propertie_id, photo_url) VALUES (?, ?)`,
            [propertyId, `${file.filename}`]
          )
        );
        await Promise.all(imagePromises);
      }
  
      res.status(201).json({ message: 'Propiedad y fotos registradas exitosamente' });
    } catch (error) {
      console.error('Error al registrar la propiedad:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  };


  exports.updateProperty = async (req, res) => {
    const { propertie_id, property_type, townhall_id, description, street,
      street_number, street_private_number, cologne, postal_code, price } = req.body;
    // Validación de campos
    if (
      !propertie_id ||
      !property_type ||
      !townhall_id ||
      !description ||
      !street ||
      !street_number ||
      !cologne ||
      !price
    ) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    if(!street_private_number){
      street_private_number = 1;
    }

    try {
      const [result] = await db.execute("UPDATE properties SET property_type = ?, townhall_id = ?, description = ?, street = ?, street_number = ?, street_private_number = ?, cologne = ?, postal_code = ?, price = ? WHERE propertie_id = ?",
        [property_type, townhall_id, description, street, street_number, street_private_number, cologne, postal_code, price, propertie_id]
      );
  
      await db.execute("DELETE FROM photos WHERE propertie_id = ?",[propertie_id]);
      // Guardar las fotos si existen
      if (req.files && req.files.length > 0) {
        const imagePromises = req.files.map((file) =>
          db.execute(
            `INSERT INTO photos (propertie_id, photo_url) VALUES (?, ?)`,
            [propertie_id, `${file.filename}`]
          )
        );
        await Promise.all(imagePromises);
      }
  
      res.status(201).json({ message: 'Propiedad y fotos actualizadas exitosamente' });
    } catch (error) {
      console.error('Error al actualizar la propiedad:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  };

  exports.deleteProperty = async (req, res) => {
    const {propertie_id} = req.body;

    // Validación de campos
    if (!propertie_id) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }
  
    try {
      await db.execute("DELETE FROM comments WHERE rented_id IN (SELECT rented_id FROM users_rented WHERE propertie_id = ?)",[propertie_id]);
      await db.execute("DELETE FROM ratings WHERE rented_id IN (SELECT rented_id FROM users_rented WHERE users_rented.propertie_id = ?)",[propertie_id]);
      await db.execute("DELETE FROM users_rented WHERE propertie_id = ?",[propertie_id]);
      await db.execute("DELETE FROM interested WHERE propertie_id = ?",[propertie_id]);
      await db.execute("DELETE FROM favorites WHERE propertie_id = ?",[propertie_id]);
      await db.execute("DELETE FROM photos WHERE propertie_id = ?",[propertie_id]);
      await db.execute("DELETE FROM properties WHERE propertie_id = ?",[propertie_id]);
  
      res.status(201).json({ message: 'Propiedad eliminada correctamente' });
    } catch (error) {
      console.error('Error al eliminar la propiedad:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  };

  exports.getstudentinterested = async (req, res) => {
    const { propertie_id} = req.body;
    const userId = req.userId;

    if (!propertie_id) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }
  
    try {
      const [response] = await db.execute("SELECT CONCAT(u.name, ' ', u.lastname) AS fullName, u.user_id FROM interested i JOIN users u ON i.user_id = u.user_id WHERE i.propertie_id = ?",
        [propertie_id]
      );
      res.status(201).json(response);
    } catch (error) {
      console.error('Error en obtener estudiantes interesados:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  };


  exports.modifyStatusOfProperty = async (req, res) => {
    const { clearUsers, status, user_id, propertie_id, propertie_owner_id} = req.body;
    const userId = req.userId;

    if (!propertie_id) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }
  
    try {

      const [response] = await db.execute("SELECT * FROM properties WHERE propertie_id = ? AND propertie_owner_id = ?",[propertie_id, propertie_owner_id]);

      if (!(response.length > 0)) {
        return res.status(401).json({ message: 'No es el propietario' });
      }

      if(clearUsers){
        //clear users
        await db.execute("DELETE FROM interested WHERE propertie_id = ?",[propertie_id]);
      }

      if(status != null){
        //update status
        await db.execute("UPDATE properties SET available = ? WHERE propertie_id = ?",[status,propertie_id]);
      }

      if(user_id != -1){
        await db.execute("INSERT INTO users_rented (user_id, propertie_id, calified) VALUES (?, ?, ?)",[user_id, propertie_id, false]);
      }

      res.status(201).json({ message: 'Se actualizo el estado del inmueble correctamente' });
    } catch (error) {
      console.error('Error en obtener estudiantes interesados:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  };

exports.getusertype = async (req, res) => {
  try {
    // El user_id se obtiene del token validado
    const userId = req.userId;

    // Consulta para obtener los datos del usuario
    const [rows] = await db.execute(
      'SELECT user_id, user_type_id FROM users WHERE user_id = ?',
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Devolver los datos del usuario
    res.json(rows[0]);
  } catch (error) {
    console.error('Error al obtener el perfil:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }  
};

exports.getmyproperties = async (req, res) => {
  try {
    const userId = req.userId;

    // Consulta para obtener las propiedades del usuario
    const [rows] = await db.execute(
      'SELECT properties.propertie_id, property_type.property_name, properties.price, properties.available, photos.photo_url FROM properties JOIN property_type ON properties.property_type = property_type.property_id LEFT JOIN (SELECT propertie_id, photo_url FROM photos GROUP BY propertie_id) AS photos ON properties.propertie_id = photos.propertie_id WHERE properties.propertie_owner_id = ?',
      [userId]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'No hay propiedades' });
    }
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener el perfil:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }  
};

exports.verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).json({ message: 'Token requerido' });

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Token inválido' });
    req.userId = decoded.userId;
    next();
  });
};

