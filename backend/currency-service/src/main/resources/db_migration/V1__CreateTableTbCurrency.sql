CREATE TABLE tb_currency (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  source_currency CHAR(3) NOT NULL,
  target_currency CHAR(3) NOT NULL,
  conversion_rate DECIMAL(10,2) NOT NULL
);