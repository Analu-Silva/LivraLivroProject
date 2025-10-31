INSERT INTO tb_book_condition (condition)
VALUES ('Novo'), ('Usado');

INSERT INTO tb_book_genre (genre)
VALUES ('Acadêmicos'), ('Ação'), ('Autoajuda'), ('Aventura'), ('Biografia'), ('Ciência'), ('Contos'), ('Crônicas'), ('Drama'), ('Fantasia'),
('Ficção'), ('Mistério'), ('Poesia'), ('Romance'), ('Suspense'), ('Terror');

WITH inserted_book AS (
	INSERT INTO tb_book (image_url, title, price, currency, number_of_pages, book_condition_id, number_of_years, isbn, publisher, stock, seller, description)
	VALUES ('url', 'A parede', 34.90, 'USD', 345, 1, 3, '3765768234456', 'Minha editora', 4, '1c5e86e5-ad6a-4981-8611-c02e8a33fc64', 'O livro fala sobre paredes')
	RETURNING id
)

INSERT INTO tb_book_genres (book_id, genre_id)
VALUES
	((SELECT id FROM inserted_book), 3),
	((SELECT id FROM inserted_book), 4);