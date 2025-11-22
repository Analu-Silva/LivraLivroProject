CREATE TABLE tb_cart (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE
);

CREATE TABLE tb_cart_item (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    book_id UUID NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    cart_id UUID NOT NULL,
    CONSTRAINT fk_cart
        FOREIGN KEY(cart_id) 
        REFERENCES tb_cart(id)
        ON DELETE CASCADE
);

