DROP TABLE IF EXISTS review CASCADE;
DROP TABLE IF EXISTS "order" CASCADE;
DROP TABLE IF EXISTS offer CASCADE;
DROP TABLE IF EXISTS vehicule CASCADE;
DROP TABLE IF EXISTS profile CASCADE;
DROP TABLE IF EXISTS manager CASCADE;
DROP TABLE IF EXISTS favorite CASCADE;
DROP TYPE IF EXISTS payment_status;

CREATE TABLE profile (
    profile_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
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
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed');

CREATE TABLE "order" (
    order_id SERIAL PRIMARY KEY,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
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
    order_id INT NOT NULL,
    FOREIGN KEY (order_id) REFERENCES "order"(order_id) ON DELETE CASCADE,
    FOREIGN KEY (customer_id) REFERENCES profile(profile_id) ON DELETE CASCADE,
    FOREIGN KEY (renter_id) REFERENCES profile(profile_id) ON DELETE CASCADE
);

CREATE TABLE manager(
                        id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
                        name varchar,
                        email varchar UNIQUE,
                        password varchar
);

CREATE TABLE favorite (
    favorite_id SERIAL PRIMARY KEY,
    profile_id INT NOT NULL,
    vehicule_id INT NOT NULL,
    UNIQUE (profile_id, vehicule_id),
    FOREIGN KEY (profile_id) REFERENCES profile(profile_id) ON DELETE CASCADE,
    FOREIGN KEY (vehicule_id) REFERENCES vehicule(vehicule_id) ON DELETE CASCADE
);





INSERT INTO profile (name, email, password, adress, bank_account, is_renter, profile_picture)
VALUES 
('Alex Dupont', 'alex@mail.com', 'password123', 'Rue du Centre 10, Namur', 'BE12 3456 7890 1234', TRUE, 'alex.png'),
('Marie Martin', 'marie@mail.com', 'securepass', 'Avenue du Roi 45, Liège', 'BE56 7890 4321 9876', FALSE, 'marie.png');

-- 2️⃣ Véhicule appartenant à Alex (le loueur)
INSERT INTO vehicule (model, licence_plate, description, owner_id)
VALUES 
('Peugeot 208', '1-ABC-234', 'Petite citadine 5 portes, essence.', 1);

-- 3️⃣ Offre liée à la voiture d’Alex
INSERT INTO offer (start_date, end_date, fuel_level, adress, price, description, vehicule_id)
VALUES 
('2025-11-10', '2025-11-20', 100.00, 'Rue du Centre 10, Namur', 50.00, 'Location voiture propre et fiable', 1);

-- 4️⃣ Commande (order) faite par Marie sur l’offre d’Alex
INSERT INTO "order" (order_date, date_of_return, fuel_level_return, payment_status, offer_id, customer_id)
VALUES 
(CURRENT_TIMESTAMP, '2025-11-20', 90.00, 'completed', 1, 2);

-- 5️⃣ Review laissée par Marie pour Alex après sa commande
INSERT INTO review (rating, comment, customer_id, renter_id, order_id)
VALUES 
(5, 'Super expérience, voiture nickel !', 2, 1, 1);

-- 6️⃣ Manager du système
INSERT INTO manager (name, email, password)
VALUES 
('Admin', 'admin@mail.com', 'adminpass');