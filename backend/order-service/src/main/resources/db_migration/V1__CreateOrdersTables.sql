CREATE TABLE tb_payment_method (
	id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	method VARCHAR(30) NOT NULL UNIQUE
);

CREATE TABLE tb_order (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_date TIMESTAMP NOT NULL,
	payment_method_id INTEGER NOT NULL,
	FOREIGN KEY (payment_method_id) REFERENCES tb_payment_method (id),
    customer_id UUID NOT NULL,
    shipping NUMERIC(4,2) 
);

CREATE TABLE tb_order_item (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    book_id UUID NOT NULL,
    quantity INTEGER NOT NULL,
    price_at_purchase NUMERIC(7,2) NOT NULL,
    currency_at_purchase CHAR(3) NOT NULL,
    order_id UUID,
    CONSTRAINT fk_order
        FOREIGN KEY(order_id) 
        REFERENCES tb_order(id)
        ON DELETE CASCADE
);
