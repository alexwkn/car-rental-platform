-- Active: 1763035184026@@127.0.0.1@5432

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
('Marie Martin', 'marie@mail.com', 'securepass', 'Avenue du Roi 45, Liège', 'BE56 7890 4321 9876', FALSE, 'marie.png'),
('Lucas Bernard', 'lucas@mail.com', 'pass1', 'Charleroi', 'BE11 1111 1111 1111', TRUE, 'lucas.png'),
('Sophie Leroy', 'sophie@mail.com', 'pass2', 'Bruxelles', 'BE22 2222 2222 2222', TRUE, 'sophie.png'),
('Thomas Petit', 'thomas@mail.com', 'pass3', 'Namur', 'BE33 3333 3333 3333', FALSE, 'thomas.png'),
('Emma Dubois', 'emma@mail.com', 'pass4', 'Mons', 'BE44 4444 4444 4444', FALSE, 'emma.png'),
('Julien Simon', 'julien@mail.com', 'pass5', 'Liège', 'BE55 5555 5555 5555', FALSE, 'julien.png'),
('Nicolas Fontaine', 'nicolas@mail.com', 'pass6', 'Dinant', 'BE66 6666 6666 6666', TRUE, 'nico.png'),
('Laura Meunier', 'laura@mail.com', 'pass7', 'Bruxelles', 'BE77 7777 7777 7777', FALSE, 'laura.png'),
('Kevin Lambert', 'kevin@mail.com', 'pass8', 'Arlon', 'BE88 8888 8888 8888', TRUE, 'kevin.png'),
('Chloé Renard', 'chloe@mail.com', 'pass9', 'Namur', 'BE99 9999 9999 9999', FALSE, 'chloe.png'),
('Antoine Gillard', 'antoine.g@mail.com', 'client1', 'Namur', 'BE10 1010 1010 1010', FALSE, 'antoine.png'),
('Camille Rousseau', 'camille.r@mail.com', 'client2', 'Liège', 'BE20 2020 2020 2020', FALSE, 'camille.png'),
('Maxime Colin', 'maxime.c@mail.com', 'client3', 'Bruxelles', 'BE30 3030 3030 3030', FALSE, 'maxime.png'),
('Sarah Delcourt', 'sarah.d@mail.com', 'client4', 'Mons', 'BE40 4040 4040 4040', FALSE, 'sarah.png'),
('Hugo Van Damme', 'hugo.v@mail.com', 'client5', 'Charleroi', 'BE50 5050 5050 5050', FALSE, 'hugo.png'),
('Julie Lefèvre', 'julie.l@mail.com', 'client6', 'Namur', 'BE60 6060 6060 6060', FALSE, 'julie.png'),
('Paul Moreau', 'paul.m@mail.com', 'client7', 'Arlon', 'BE70 7070 7070 7070', FALSE, 'paul.png'),
('Élodie Bernard', 'elodie.b@mail.com', 'client8', 'Bruxelles', 'BE80 8080 8080 8080', FALSE, 'elodie.png');



INSERT INTO vehicule (model, licence_plate, description, owner_id)
VALUES 
('Peugeot 208', '1-ABC-234', 'Petite citadine 5 portes, essence.', 1),
('Renault Clio', '1-DEF-456', 'Citadine diesel économique', 3),
('Tesla Model 3', '1-GHI-789', 'Voiture électrique automatique', 4),
('Volkswagen Golf', '1-JKL-012', 'Confort et fiabilité', 1),
('BMW Série 1', '1-MNO-345', 'Compacte premium', 3),
('Audi A3', '2-AAA-111', 'Berline compacte confortable', 8),
('Toyota Yaris', '2-BBB-222', 'Petite voiture hybride', 10),
('Ford Focus', '2-CCC-333', 'Idéale pour famille', 3),
('Mercedes Classe A', '2-DDD-444', 'Compacte haut de gamme', 9),
('Opel Corsa', '2-EEE-555', 'Citadine pratique et économique', 1);



INSERT INTO offer (start_date, end_date, fuel_level, adress, price, description, vehicule_id)
VALUES 
('2025-11-10', '2025-11-20', 100.00, 'Rue du Centre 10, Namur', 50.00, 'Location voiture propre et fiable', 1),
('2025-12-01', '2025-12-10', 100, 'Charleroi', 45.00, 'Parfaite pour la ville', 2),
('2025-12-05', '2025-12-15', 100, 'Bruxelles', 90.00, 'Électrique et silencieuse', 3),
('2025-11-25', '2025-12-05', 80, 'Namur', 60.00, 'Idéale pour longs trajets', 4),
('2025-12-10', '2025-12-20', 100, 'Charleroi', 75.00, 'Voiture récente et propre', 5),
('2026-01-05', '2026-01-15', 100, 'Dinant', 70.00, 'Voiture très confortable', 6),
('2026-01-10', '2026-01-20', 90, 'Bruxelles', 40.00, 'Économique et maniable', 7),
('2026-01-01', '2026-01-10', 100, 'Namur', 65.00, 'Voiture fiable', 8),
('2026-01-12', '2026-01-25', 100, 'Arlon', 85.00, 'Parfaite pour autoroute', 9);

INSERT INTO "order" (order_date, date_of_return, fuel_level_return, payment_status, offer_id, customer_id)
VALUES 
('2025-11-18', '2025-11-20', 90.00, 'completed', 1, 2),
('2025-12-08', '2025-12-10', 85.00, 'completed', 2, 5),
('2025-12-13', '2025-12-15', 100.00, 'completed', 3, 6),
('2025-12-03', '2025-12-05', 70.00, 'pending', 4, 7),
('2025-12-18', '2025-12-20', 95.00, 'completed', 5, 2),
('2026-01-13', '2026-01-15', 95.00, 'completed', 6, 6),
('2026-01-18', '2026-01-20', 80.00, 'completed', 7, 11),
('2026-01-08', '2026-01-10', 100.00, 'failed', 8, 2),
('2026-01-23', '2026-01-25', 90.00, 'pending', 9, 12);

INSERT INTO review (rating, comment, customer_id, renter_id, order_id)
VALUES 
(5, 'Super expérience, voiture nickel !', 2, 1, 1),
(4, 'Bonne voiture, facile à conduire', 5, 3, 2),
(5, 'Tesla incroyable, super expérience', 6, 4, 3),
(3, 'Correct mais un peu sale', 7, 1, 4),
(5, 'Très bon loueur, je recommande', 2, 3, 5),
(4, 'Voiture confortable mais un peu chère', 6, 8, 6),
(5, 'Parfait pour mon voyage', 11, 10, 7),
(2, 'Déçu par létat de la voiture', 2, 3, 8),
(5, 'Excellente voiture et service', 12, 9, 9),
(5, 'Parfait, voiture impeccable', 6, 8, 6),
(4, 'Bon rapport qualité/prix', 11, 10, 7),
(2, 'Paiement refusé, dommage', 2, 3, 8),
(5, 'Service très professionnel', 12, 9, 9);

INSERT INTO favorite (profile_id, vehicule_id)
VALUES
(2, 1),
(2, 2),
(2, 3),
(5, 1),
(6, 3),
(7, 4),
(11, 5),
(12, 6),
(2, 4),
(2, 5),
(6, 1),
(6, 6),
(11, 7),
(12, 9),
(5, 8),
(7, 6);

INSERT INTO manager (name, email, password)
VALUES 
('Admin', 'admin@mail.com', 'adminpass');