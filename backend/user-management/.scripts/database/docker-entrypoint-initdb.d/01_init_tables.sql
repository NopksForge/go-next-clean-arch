CREATE TABLE users (
     user_id UUID PRIMARY KEY,
     user_email VARCHAR(200),
     user_first_name VARCHAR(200),
     user_last_name VARCHAR(200),
     user_phone_number VARCHAR(10),
     user_role VARCHAR(50),
     updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
     is_active BOOLEAN NOT NULL DEFAULT TRUE
);