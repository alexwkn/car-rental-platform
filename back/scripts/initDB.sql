DROP TABLE IF EXISTS review CASCADE;
DROP TABLE IF EXISTS "order" CASCADE;
DROP TABLE IF EXISTS offer CASCADE;
DROP TABLE IF EXISTS vehicule CASCADE;
DROP TABLE IF EXISTS profile CASCADE;

CREATE TABLE profile (
    profile_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    adress TEXT,
    bank_account VARCHAR(50),
    is_renter BOOLEAN DEFAULT FALSE,
    profile_picture TEXT
);

CREATE TABLE vehicule (
    vehicule_id SERIAL PRIMARY KEY,
    model VARCHAR(100) NOT NULL,
    licence_plate VARCHAR(20) UNIQUE NOT NULL,
    description TEXT,
    owner_id INT NOT NULL,
    FOREIGN KEY (owner_id) REFERENCES profile(profile_id) ON DELETE CASCADE
);

CREATE TABLE offer (
    offer_id SERIAL PRIMARY KEY,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    fuel_level DECIMAL(5,2),
    adress TEXT,
    price DECIMAL(10,2) NOT NULL,
    description TEXT,
    vehicule_id INT NOT NULL,
    FOREIGN KEY (vehicule_id) REFERENCES vehicule(vehicule_id) ON DELETE CASCADE
);

CREATE TABLE "order" (
    order_id SERIAL PRIMARY KEY,
    order_date DATE NOT NULL,
    date_of_return DATE,
    fuel_level_return DECIMAL(5,2),
    payment_status VARCHAR(30) DEFAULT 'pending',
    offer_id INT NOT NULL,
    customer_id INT NOT NULL,
    FOREIGN KEY (offer_id) REFERENCES offer(offer_id) ON DELETE CASCADE,
    FOREIGN KEY (customer_id) REFERENCES profile(profile_id) ON DELETE CASCADE
);

CREATE TABLE review (
    review_id SERIAL PRIMARY KEY,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    review_date DATE DEFAULT CURRENT_DATE,
    customer_id INT NOT NULL,
    renter_id INT NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES profile(profile_id) ON DELETE CASCADE,
    FOREIGN KEY (renter_id) REFERENCES profile(profile_id) ON DELETE CASCADE
);
