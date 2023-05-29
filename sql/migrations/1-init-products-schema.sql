CREATE TABLE products
(
    sku           VARCHAR(255) PRIMARY KEY,
    name          VARCHAR(255)   NOT NULL,
    price         NUMERIC(10, 2) NOT NULL,
    inventory_qty INT            NOT NULL
);