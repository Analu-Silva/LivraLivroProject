CREATE TABLE tb_user_profile_genre (
	id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	genre VARCHAR(20) UNIQUE
);

CREATE TABLE tb_user_profile (
	id UUID PRIMARY KEY,
	name VARCHAR(255) NOT NULL,
    cpf VARCHAR(11) UNIQUE NOT NULL,
	phone_number VARCHAR(20) NOT NULL,
    date_of_birth DATE NOT NULL,
    
    --Perfil
    user_image_url VARCHAR(255),
    user_genre_id INTEGER,
    description VARCHAR(255)
);

CREATE TABLE tb_user_address(
	id UUID PRIMARY KEY,
	cep VARCHAR(8),
    city VARCHAR(100) NOT NULL, 
    state VARCHAR(2) NOT NULL, 
    neighborhood VARCHAR(100),
    street VARCHAR(100),
    street_number VARCHAR(20),
    complement VARCHAR(255),
    FOREIGN KEY (id) REFERENCES tb_user_profile (id)
);

