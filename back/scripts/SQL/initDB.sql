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
('Marie Martin', 'marie@mail.com', 'securepass', 'Avenue du Roi 45, Liège', 'BE56 7890 4321 9876', TRUE, 'marie.png'),
('Lucas Bernard', 'lucas@mail.com', 'pass1', 'Charleroi', 'BE11 1111 1111 1111', TRUE, NULL),
('Sophie Leroy', 'sophie@mail.com', 'pass2', 'Bruxelles', 'BE22 2222 2222 2222', TRUE, NULL),
('Thomas Petit', 'thomas@mail.com', 'pass3', 'Namur', 'BE33 3333 3333 3333', FALSE, NULL),
('Emma Dubois', 'emma@mail.com', 'pass4', 'Mons', 'BE44 4444 4444 4444', FALSE, NULL),
('Julien Simon', 'julien@mail.com', 'pass5', 'Liège', 'BE55 5555 5555 5555', FALSE, NULL),
('Nicolas Fontaine', 'nicolas@mail.com', 'pass6', 'Dinant', 'BE66 6666 6666 6666', TRUE, NULL),
('Laura Meunier', 'laura@mail.com', 'pass7', 'Bruxelles', 'BE77 7777 7777 7777', FALSE, NULL),
('Kevin Lambert', 'kevin@mail.com', 'pass8', 'Arlon', 'BE88 8888 8888 8888', TRUE, NULL),
('Chloé Renard', 'chloe@mail.com', 'pass9', 'Namur', 'BE99 9999 9999 9999', FALSE, NULL),
('Antoine Gillard', 'antoine.g@mail.com', 'client1', 'Namur', 'BE10 1010 1010 1010', FALSE, NULL),
('Camille Rousseau', 'camille.r@mail.com', 'client2', 'Liège', 'BE20 2020 2020 2020', FALSE, NULL),
('Maxime Colin', 'maxime.c@mail.com', 'client3', 'Bruxelles', 'BE30 3030 3030 3030', FALSE, NULL),
('Sarah Delcourt', 'sarah.d@mail.com', 'client4', 'Mons', 'BE40 4040 4040 4040', FALSE, NULL),
('Hugo Van Damme', 'hugo.v@mail.com', 'client5', 'Charleroi', 'BE50 5050 5050 5050', FALSE, NULL),
('Julie Lefèvre', 'julie.l@mail.com', 'client6', 'Namur', 'BE60 6060 6060 6060', FALSE, NULL),
('Paul Moreau', 'paul.m@mail.com', 'client7', 'Arlon', 'BE70 7070 7070 7070', FALSE, NULL),
('Élodie Bernard', 'elodie.b@mail.com', 'client8', 'Bruxelles', 'BE80 8080 8080 8080', FALSE, NULL);



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
('Opel Corsa', '2-EEE-555', 'Citadine pratique et économique', 2),
('Volvo XC40', '3-FFF-666', 'SUV compact confortable, hybride', 8),
('Citroën C3', '3-GGG-777', 'Citadine récente et économique', 10),
('Kia Sportage', '3-HHH-888', 'SUV familial spacieux, idéal pour route', 3),
('Seat Ibiza', '3-III-999', 'Citadine agile, faible conso', 4);



INSERT INTO offer (start_date, end_date, fuel_level, adress, price, description, vehicule_id)
VALUES
('2026-06-01', '2026-06-30', 100.00, 'Rue du Centre 10, Namur', 50.00, 'Location voiture propre et fiable', 1),
('2026-07-15', '2026-08-25', 100, 'Charleroi', 45.00, 'Parfaite pour la ville', 2),
('2026-07-20', '2026-08-30', 100, 'Bruxelles', 90.00, 'Électrique et silencieuse', 3),
('2026-06-15', '2026-06-30', 80, 'Namur', 60.00, 'Idéale pour longs trajets', 4),
('2026-07-01', '2026-07-15', 100, 'Charleroi', 75.00, 'Voiture récente et propre', 5),
('2026-07-15', '2026-07-25', 100, 'Dinant', 70.00, 'Voiture très confortable', 6),
('2026-07-20', '2026-07-30', 90, 'Bruxelles', 40.00, 'Économique et maniable', 7),
('2026-07-10', '2026-07-20', 100, 'Namur', 65.00, 'Voiture fiable', 8),
('2026-07-25', '2026-08-05', 100, 'Arlon', 85.00, 'Parfaite pour autoroute', 9),
('2026-08-10', '2026-08-20', 100, 'Rue du Président 10, Namur', 55.00, 'Idéale pour déplacements urbains', 10),
('2026-08-15', '2026-08-25', 100, 'Avenue Louise 50, Bruxelles', 95.00, 'Confort et style garantis', 1),
('2026-08-20', '2026-08-30', 100, 'Place Saint-Lambert 5, Liège', 60.00, 'Parfaite pour petits trajets', 2),
('2026-08-15', '2026-08-25', 100, 'Boulevard de la Woluwe 120, Bruxelles', 110.00, 'SUV hybride récent, parfait weekend', 11),
('2026-08-20', '2026-08-30', 100, 'Rue de la Gare 14, Liège', 58.00, 'Citadine idéale pour la ville', 12),
('2026-08-12', '2026-08-22', 100, 'Rue de Fer 12, Namur', 68.00, 'SUV familial prêt pour les vacances', 13),
('2026-08-25', '2026-09-05', 100, 'Avenue Albert 1er 20, Namur', 52.00, 'Citadine parfaite en ville', 14),
('2026-09-01', '2026-09-10', 100, 'Place dArmes 5, Namur', 105.00, 'SUV hybride haut de gamme', 11),
('2026-08-28', '2026-09-07', 100, 'Chaussée de Louvain 90, Namur', 59.00, 'Citadine récente et économique', 12);


INSERT INTO "order" (order_date, date_of_return, fuel_level_return, payment_status, offer_id, customer_id)
VALUES
('2026-06-10', '2026-06-12', 90.00, 'completed', 1, 2),
('2026-06-25', '2026-06-27', 70.00, 'pending', 4, 7),
('2026-07-10', '2026-07-12', 95.00, 'completed', 5, 2),
('2026-07-20', '2026-07-22', 95.00, 'completed', 6, 6),
('2026-07-25', '2026-07-27', 80.00, 'completed', 7, 11),
('2026-07-15', '2026-07-17', 100.00, 'failed', 8, 2),
('2026-07-30', '2026-08-01', 90.00, 'pending', 9, 12),
-- Orders pour Alex Dupont (customer_id = 1)
('2026-06-20', '2026-06-23', 85.00, 'completed', 1, 1),  -- Historique (passé)
('2026-07-20', '2026-08-20', NULL, 'pending', 2, 1),     -- En cours (retour futur)
('2026-07-25', '2026-08-25', NULL, 'pending', 3, 1);     -- En cours (retour futur)


INSERT INTO review (rating, comment, customer_id, renter_id, order_id)
VALUES
(5, 'Super expérience, voiture nickel !', 1, 4, 10),
(4, 'Bonne voiture, facile à conduire', 7, 1, 2),
(5, 'Tesla incroyable, super expérience', 2, 3, 3),
(3, 'Correct mais un peu sale', 6, 8, 4),
(5, 'Très bon loueur, je recommande', 11, 10, 5),
(4, 'Voiture confortable mais un peu chère', 2, 3, 6),
(5, 'Parfait pour mon voyage', 12, 9, 7),
(2, 'Déçu par létat de la voiture', 1, 1, 8),
(5, 'Excellente voiture et service', 1, 3, 9);

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