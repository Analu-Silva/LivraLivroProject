CREATE TABLE tb_book_condition (
	id SERIAL PRIMARY KEY,
	condition VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE tb_book_genre (
	id SERIAL PRIMARY KEY,
	genre VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE tb_book (
	id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
	image_url VARCHAR(255),
	title VARCHAR(255) NOT NULL,
	price NUMERIC(7,2) NOT NULL CHECK (price > 0),
	currency VARCHAR(3) NOT NULL, 
	number_of_pages INTEGER NOT NULL,
	book_condition_id INTEGER,
	number_of_years INTEGER NOT NULL,
	isbn VARCHAR(13) UNIQUE,
	publisher VARCHAR(255) NOT NULL,
	stock INTEGER NOT NULL,
	seller UUID NOT NULL,
	description TEXT CHECK (length(description) <= 2000)
);

CREATE TABLE tb_book_genres (
	book_id UUID NOT NULL,
	genre_id INTEGER NOT NULL, 
	PRIMARY KEY (book_id, genre_id),
	FOREIGN KEY (book_id) REFERENCES tb_book (id),
	FOREIGN KEY (genre_id) REFERENCES tb_book_genre (id)
);

	
	
	

	


	