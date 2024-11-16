CREATE TABLE products (
    product_id UUID PRIMARY KEY,
    product_name VARCHAR(200),
    price NUMERIC(10,2),
    created_by VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_by VARCHAR(50),
    updated_at TIMESTAMP
);

CREATE TABLE users (
     user_id UUID PRIMARY KEY,
     user_email VARCHAR(200),
     user_name VARCHAR(200),
     created_by VARCHAR(50) NOT NULL,
     created_at TIMESTAMP NOT NULL DEFAULT NOW(),
     updated_by VARCHAR(50),
     updated_at TIMESTAMP
);
