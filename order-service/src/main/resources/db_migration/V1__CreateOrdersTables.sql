CREATE TABLE tb_order (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_date TIMESTAMP NOT NULL,
    customer_id UUID NOT NULL
);

CREATE TABLE tb_order_item (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID NOT NULL,
    quantity INTEGER NOT NULL,
    price_at_purchase NUMERIC(7,2) NOT NULL,
    currency_at_purchase varchar(3) not null,
    order_id UUID,
    CONSTRAINT fk_order
        FOREIGN KEY(order_id) 
        REFERENCES tb_order(id)
        ON DELETE CASCADE
);

