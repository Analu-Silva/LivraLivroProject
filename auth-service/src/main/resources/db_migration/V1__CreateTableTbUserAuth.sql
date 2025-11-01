CREATE TABLE tb_user_auth (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        TYPE SMALLINT CHECK (TYPE BETWEEN 0 AND 1)
);