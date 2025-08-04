const db = require('./db');

exports.getSchoolsList = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM schools');
    res.json(rows);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

exports.getTypesOfProperty = async (req, res) => {
    try {
      const [rows] = await db.execute('SELECT * FROM property_type');
      res.json(rows);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
};

exports.getTownhalls = async (req, res) => {
    try {
      const [rows] = await db.execute('SELECT * FROM town_hall');
      res.json(rows);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
};

exports.getallproperties = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT properties.propertie_id, properties.property_type, property_type.property_name, properties.price, properties.townhall_id, town_hall.townhall_name AS alcaldia, photos.photo_url FROM properties JOIN property_type ON properties.property_type = property_type.property_id JOIN town_hall ON properties.townhall_id = town_hall.townhall_id LEFT JOIN (SELECT propertie_id, photo_url FROM photos GROUP BY propertie_id) AS photos ON properties.propertie_id = photos.propertie_id WHERE properties.available = 1');
    res.json(rows);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

//

exports.getmaxminprices = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT MAX(price) AS max_price, MIN(price) AS min_price FROM properties');
    res.json(rows);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

exports.getdetailsofproperty = async (req, res) => {
  const { propertie_id } = req.params; // Obtener el ID desde los parámetros
  try {
    const [rows] = await db.execute('SELECT properties.propertie_id, property_type.property_name, town_hall.townhall_name, properties.description, properties.street, properties.street_number, properties.street_private_number, properties.cologne, properties.postal_code, properties.price, GROUP_CONCAT(photos.photo_url) AS photos FROM properties JOIN property_type ON properties.property_type = property_type.property_id JOIN town_hall ON properties.townhall_id = town_hall.townhall_id LEFT JOIN photos ON properties.propertie_id = photos.propertie_id WHERE properties.propertie_id = ? GROUP BY properties.propertie_id, property_type.property_name, town_hall.townhall_name, properties.description, properties.street, properties.street_number, properties.street_private_number, properties.cologne, properties.postal_code, properties.price;',
      [propertie_id]
    );
    res.json(rows);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

exports.getcommentsofproperty = async (req, res) => {
  const { propertie_id } = req.params; // Obtener el ID desde los parámetros
  try {
    const [rows] = await db.execute("SELECT CONCAT(users.name, ' ', users.lastname) AS fullname, comments.comment FROM comments JOIN users_rented ON comments.rented_id = users_rented.rented_id JOIN users ON users_rented.user_id = users.user_id WHERE users_rented.propertie_id = ?;",
      [propertie_id]
    );
    res.json(rows);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

exports.getrateofproperty = async (req, res) => {
  const { propertie_id } = req.params; // Obtener el ID desde los parámetros
  try {
    const [rows] = await db.execute("SELECT SUM(r.rating) AS total_ratings_value, COUNT(r.rating) AS total_ratings_count FROM ratings r JOIN users_rented ur ON r.rented_id = ur.rented_id JOIN properties p ON ur.propertie_id = p.propertie_id WHERE p.propertie_id = ?",
      [propertie_id]
    );
    res.json(rows);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

exports.getgeneraldataofproperty = async (req, res) => {
  try {
    const { propertie_id } = req.params; // Obtener el ID desde los parámetros
    const userId = req.userId;

    // Consulta para obtener los datos del usuario
    const [rows] = await db.execute(
      'SELECT * FROM properties WHERE propertie_id = ?',
      [propertie_id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Propiedad no encontrada' });
    }

    // Devolver los datos del usuario
    res.json(rows[0]);
  } catch (error) {
    console.error('Error al obtener el perfil:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }  
};