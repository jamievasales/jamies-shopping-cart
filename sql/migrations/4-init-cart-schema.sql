CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE carts
(
--     Not a uuid for simple testing purposes
    id         VARCHAR(255) PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cart_items
(
    id         UUID                     DEFAULT uuid_generate_v4() PRIMARY KEY,
    sku        VARCHAR(255) NOT NULL REFERENCES products (sku) ON DELETE CASCADE,
    cart_id    VARCHAR(255) NOT NULL REFERENCES carts (id) ON DELETE CASCADE,
    quantity   INT          NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);