CREATE TABLE tb_wishlist (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE
);

CREATE TABLE tb_wishlist_item (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    book_id UUID NOT NULL,
    wishlist_id UUID NOT NULL,
    CONSTRAINT fk_wishlist
        FOREIGN KEY(wishlist_id) 
        REFERENCES tb_wishlist(id)
        ON DELETE CASCADE,
    CONSTRAINT unique_book_wishlist
        UNIQUE(book_id, wishlist_id)
);

