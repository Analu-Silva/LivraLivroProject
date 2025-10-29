CREATE TABLE tb_user (
        id UUID DEFAULT gen_random_uuid() NOT NULL,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        TYPE SMALLINT CHECK (TYPE BETWEEN 0 AND 1),
        PRIMARY KEY (id)
    )