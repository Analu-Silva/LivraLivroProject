CREATE TABLE tb_user_profile_genre (
	id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	genre VARCHAR(20) UNIQUE
);

CREATE TABLE tb_user_profile (
	id UUID PRIMARY KEY,
	name VARCHAR(255) NOT NULL,
    cpf CHAR(11) UNIQUE NOT NULL,
	phone_number VARCHAR(20) NOT NULL,
    date_of_birth DATE NOT NULL,
    user_image_url TEXT,
    user_genre_id INTEGER,
    FOREIGN KEY (user_genre_id) REFERENCES tb_user_profile_genre (id),
    description VARCHAR(300)
);

CREATE TABLE tb_user_address(
	id UUID PRIMARY KEY,
	cep CHAR(8) NOT NULL,
    city VARCHAR(100) NOT NULL, 
    state CHAR(2) NOT NULL, 
    neighborhood VARCHAR(100) NOT NULL,
    street VARCHAR(255) NOT NULL,
    street_number VARCHAR(20),
    complement VARCHAR(255),
    FOREIGN KEY (id) REFERENCES tb_user_profile (id)
);

