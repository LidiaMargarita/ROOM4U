CREATE TABLE photos (
    photo_id INT AUTO_INCREMENT PRIMARY KEY,
    propertie_id INT,
    photo_url VARCHAR(255),
    FOREIGN KEY (propertie_id) REFERENCES properties(propertie_id)
);

CREATE TABLE user_type (
    user_type_id INT AUTO_INCREMENT PRIMARY KEY,
    user_type_name VARCHAR(20)
);

CREATE TABLE schools (
    school_id INT AUTO_INCREMENT PRIMARY KEY,
    school_name VARCHAR(50)
);

CREATE TABLE town_hall (
    townhall_id INT AUTO_INCREMENT PRIMARY KEY,
    townhall_name VARCHAR(20)
);

CREATE TABLE property_type (
    property_id INT AUTO_INCREMENT PRIMARY KEY,
    property_name VARCHAR(15)
);

CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    user_type_id INT,
    email VARCHAR(50),
    phonenumber VARCHAR(10),
    name VARCHAR(25),
    lastname VARCHAR(25),
    password VARCHAR(255),
    FOREIGN KEY (user_type_id) REFERENCES user_type(user_type_id)
);

CREATE TABLE user_schools (
    user_school_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    school_id INT,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (school_id) REFERENCES schools(school_id)
);

CREATE TABLE properties (
    propertie_id INT AUTO_INCREMENT PRIMARY KEY,
    propertie_owner_id INT,
    property_type INT,
    townhall_id INT,
    description VARCHAR(250),
    street VARCHAR(50),
    street_number VARCHAR(50),
    street_private_number VARCHAR(50),
    cologne VARCHAR(50),
    postal_code VARCHAR(5),
    available BOOL,
    price FLOAT,
    FOREIGN KEY (propertie_owner_id) REFERENCES users(user_id),
    FOREIGN KEY (property_type) REFERENCES property_type(property_id),
    FOREIGN KEY (townhall_id) REFERENCES town_hall(townhall_id)
);

CREATE TABLE comments (
    comment_id INT AUTO_INCREMENT PRIMARY KEY,
    rented_id INT,
    comment VARCHAR(200),
    FOREIGN KEY (rented_id) REFERENCES users_rented(rented_id)
);

CREATE TABLE users_rented (
    rented_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    propertie_id INT,
    calified BOOL,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (propertie_id) REFERENCES properties(propertie_id)
);

CREATE TABLE interested (
    interested_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    propertie_id INT,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (propertie_id) REFERENCES properties(propertie_id)
);

CREATE TABLE favorites (
    favorite_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    propertie_id INT,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (propertie_id) REFERENCES properties(propertie_id)
);

CREATE TABLE ratings (
    rating_id INT AUTO_INCREMENT PRIMARY KEY,
    rented_id INT,
    rating INT,
    FOREIGN KEY (rented_id) REFERENCES users_rented(rented_id)
);

INSERT INTO user_type VALUES (1,"Estudiante");
INSERT INTO user_type VALUES (2,"Propietario");


insert into property_type values (1,"Casa")
insert into property_type values (2,"Cuarto");
insert into property_type values (3,"Departamento");

insert into schools values (1,"IPN ESIME Culhuacan"),(2,"IPN ESIME Zacatenco"),(3,"IPN ESFM"),(4,"UNAM"), (5,"UAM Xochimilco"),(6,"Otra");

INSERT INTO town_hall (townhall_name) VALUES ('Álvaro Obregón'), ('Gustavo A. Madero'), ('Tláhuac'), ('Coyoacán'), ('Venustiano Carranza'), ('Miguel Hidalgo'), ('Cuauhtemoc'), ('Iztacalco'), ('Benito Juárez'), ('Cuajimalpa'), ('Tlalpan'), ('Milpa Alta'), ('La Magdalena'), ('Iztapalapa'), ('Azcapotzalco'), ('Xochimilco');