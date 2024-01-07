-- -- -- -- -- RESET -- -- -- -- --
DROP TABLE person;
DROP TABLE house;
DROP TABLE family;
-- -- -- -- -- FAMILY -- -- -- -- --
CREATE TABLE `family` (
    `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(155) NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
INSERT INTO family (name) VALUES ('Christ');
INSERT INTO family (name) VALUES ('Halpert');
INSERT INTO family (name) VALUES ('Schrute');
INSERT INTO family (name) VALUES ('Scott');
INSERT INTO family (name) VALUES ('Howard');
INSERT INTO family (name) VALUES ('Bernard');
INSERT INTO family (name) VALUES ('Philbin');
INSERT INTO family (name) VALUES ('Vance');
INSERT INTO family (name) VALUES ('Hudson');
-- -- -- -- -- HOUSE -- -- -- -- --
CREATE TABLE `house` (
    `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    `type_id` INT NOT NULL,
    `name` VARCHAR(155) NOT NULL,
    `rooms` INT NOT NULL,
    `storage` INT NOT NULL,
    `land` INT NOT NULL,
    `food` INT NOT NULL DEFAULT 0,
    `wood` INT NOT NULL DEFAULT 0,
    `family_id` INT NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT current_timestamp(),
    FOREIGN KEY (`family_id`) REFERENCES family(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
INSERT INTO house (name, rooms, storage, family_id) VALUES ('Heaven', 2, 12, 1);
INSERT INTO house (name, rooms, storage, family_id) VALUES ('Jims Parents', 4, 12, 2);
INSERT INTO house (name, rooms, storage, family_id) VALUES ('Schrute Farms', 3, 12, 3);
INSERT INTO house (name, rooms, storage, family_id) VALUES ('The Condo', 2, 12, 4);
INSERT INTO house (name, rooms, storage, family_id) VALUES ('Temps House', 3, 12, 5);
INSERT INTO house (name, rooms, storage, family_id) VALUES ('Nardville', 2, 12, 6);
INSERT INTO house (name, rooms, storage, family_id) VALUES ('Darryls', 3, 12, 7);
INSERT INTO house (name, rooms, storage, family_id) VALUES ('Refrigeration Inc', 2, 12, 8);
INSERT INTO house (name, rooms, storage, family_id) VALUES ('Florida', 3, 12, 9);
-- -- -- -- -- PERSON -- -- -- -- --
CREATE TABLE `person` (
    `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(155) NOT NULL,
    `family_id` INT NOT NULL,
    `father_id` INT NOT NULL REFERENCES person,
    `mother_id` INT NOT NULL REFERENCES person,
    `partner_id` INT REFERENCES person,
    `gender` VARCHAR(155) NOT NULL,
    `house_id` INT,
    `created_at` TIMESTAMP NOT NULL DEFAULT current_timestamp(),
    `deleted_at` TIMESTAMP,
    FOREIGN KEY (`family_id`) REFERENCES family(`id`),
    FOREIGN KEY (`house_id`) REFERENCES house(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
INSERT INTO person (name, family_id, father_id, mother_id, partner_id, gender, house_id, created_at) VALUES ('Adam', 1, 1, 2, 2, 'male', 1, date_sub(now(), interval 6000 day));
INSERT INTO person (name, family_id, father_id, mother_id, partner_id, gender, house_id, created_at) VALUES ('Eve', 1, 1, 1, 2, 'female', 1, date_sub(now(), interval 6000 day));
INSERT INTO person (name, family_id, father_id, mother_id, partner_id, gender, house_id, created_at) VALUES ('Jim', 2, 1, 3, 2, 'male', 2, date_sub(now(), interval 42 day));
INSERT INTO person (name, family_id, father_id, mother_id, partner_id, gender, house_id, created_at) VALUES ('Pam', 2, 1, 4, 2, 'female', 2, date_sub(now(), interval 39 day));
INSERT INTO person (name, family_id, father_id, mother_id, gender, house_id, created_at) VALUES ('Cecelia', 2, 3, 4, 'female', 2, date_sub(now(), interval 5 day));
INSERT INTO person (name, family_id, father_id, mother_id, gender, house_id, created_at) VALUES ('Phillip', 2, 3, 4, 'male', 2, date_sub(now(), interval 2 day));
INSERT INTO person (name, family_id, father_id, mother_id, partner_id, gender, house_id, created_at) VALUES ('Dwight', 3, 1, 8, 2, 'male', 3, date_sub(now(), interval 48 day));
INSERT INTO person (name, family_id, father_id, mother_id, partner_id, gender, house_id, created_at) VALUES ('Angela', 3, 1, 7, 2, 'female', 3, date_sub(now(), interval 39 day));
INSERT INTO person (name, family_id, father_id, mother_id, gender, house_id, created_at) VALUES ('Philip', 3, 7, 8, 'male', 3, date_sub(now(), interval 2 day));
INSERT INTO person (name, family_id, father_id, mother_id, partner_id, gender, house_id, created_at) VALUES ('Michael', 4, 1, 11, 2, 'male', 4, date_sub(now(), interval 58 day));
INSERT INTO person (name, family_id, father_id, mother_id, partner_id, gender, house_id, created_at) VALUES ('Holly', 4, 1, 10, 2, 'female', 4, date_sub(now(), interval 51 day));
INSERT INTO person (name, family_id, father_id, mother_id, partner_id, gender, house_id, created_at) VALUES ('Ryan', 5, 1, 13, 2, 'male', 5, date_sub(now(), interval 43 day));
INSERT INTO person (name, family_id, father_id, mother_id, partner_id, gender, house_id, created_at) VALUES ('Kelly', 5, 1, 12, 2, 'female', 5, date_sub(now(), interval 43 day));
INSERT INTO person (name, family_id, father_id, mother_id, gender, house_id, created_at) VALUES ('Drake', 5, 12, 13, 'male', 5, date_sub(now(), interval 8 day));
INSERT INTO person (name, family_id, father_id, mother_id, partner_id, gender, house_id, created_at) VALUES ('Andy', 6, 1, 16, 2, 'male', 6, date_sub(now(), interval 50 day));
INSERT INTO person (name, family_id, father_id, mother_id, partner_id, gender, house_id, created_at) VALUES ('Erin', 6, 1, 15, 2, 'female', 6, date_sub(now(), interval 36 day));
INSERT INTO person (name, family_id, father_id, mother_id, partner_id, gender, house_id, created_at) VALUES ('Darryl', 7, 1, 18, 2, 'male', 7, date_sub(now(), interval 51 day));
INSERT INTO person (name, family_id, father_id, mother_id, partner_id, gender, house_id, created_at) VALUES ('Val', 7, 1, 17, 2, 'female', 7, date_sub(now(), interval 46 day));
INSERT INTO person (name, family_id, father_id, mother_id, gender, house_id, created_at) VALUES ('Jada', 7, 17, 18, 'female', 7, date_sub(now(), interval 9 day));
INSERT INTO person (name, family_id, father_id, mother_id, partner_id, gender, house_id, created_at) VALUES ('Bob', 8, 1, 21, 2, 'male', 8, date_sub(now(), interval 57 day));
INSERT INTO person (name, family_id, father_id, mother_id, partner_id, gender, house_id, created_at) VALUES ('Phyllis', 8, 1, 20, 2, 'female', 8, date_sub(now(), interval 57 day));
INSERT INTO person (name, family_id, father_id, mother_id, partner_id, gender, house_id, created_at) VALUES ('Stanley', 9, 1, 23, 2, 'male', 9, date_sub(now(), interval 71 day));
INSERT INTO person (name, family_id, father_id, mother_id, partner_id, gender, house_id, created_at) VALUES ('Cynthia', 9, 1, 22, 2, 'female', 9, date_sub(now(), interval 58 day));
INSERT INTO person (name, family_id, father_id, mother_id, gender, house_id, created_at) VALUES ('Melissa', 9, 22, 23, 'female', 9, date_sub(now(), interval 24 day));
-- -- -- -- -- ACTION -- -- -- -- --
CREATE TABLE `action` (
    `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    `person_id` INT NOT NULL,
    `type_id` INT NOT NULL,
    `infinite` BOOL NOT NULL DEFAULT 0,
    `started_at` TIMESTAMP,
    `completed_at` TIMESTAMP,
    `cancelled_at` TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
INSERT INTO action (person_id, type_id, started_at) VALUES (3, 0, NOW());
-- -- -- -- -- USER -- -- -- -- --
CREATE TABLE `user` (
    `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(155) NOT NULL UNIQUE,
    `email` VARCHAR(155) NOT NULL UNIQUE,
    `password` VARCHAR(155) NOT NULL,
    `family_id` INT NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT current_timestamp(),
    `deleted_at` TIMESTAMP,
    FOREIGN KEY (`family_id`) REFERENCES family(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
INSERT INTO user (username, email, password, family_id) VALUES ('halpert', 'halpert@klofron.uk', 'password', 2);
INSERT INTO user (username, email, password, family_id) VALUES ('schrute', 'schrute@klofron.uk', 'password', 3);
INSERT INTO user (username, email, password, family_id) VALUES ('scott', 'scott@klofron.uk', 'password', 4);
INSERT INTO user (username, email, password, family_id) VALUES ('howard', 'howard@klofron.uk', 'password', 5);
INSERT INTO user (username, email, password, family_id) VALUES ('bernard', 'berndard@klofron.uk', 'password', 6);
INSERT INTO user (username, email, password, family_id) VALUES ('philbin', 'philbin@klofron.uk', 'password', 7);
INSERT INTO user (username, email, password, family_id) VALUES ('vance', 'vance@klofron.uk', 'password', 8);
INSERT INTO user (username, email, password, family_id) VALUES ('hudson', 'hudson@klofron.uk', 'password', 9);
-- -- -- -- -- TRADE -- -- -- -- --
CREATE TABLE `trade` (
    `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    `house_id` INT NOT NULL,
    `offered_type` VARCHAR(155) NOT NULL,
    `offered_volume` INT NOT NULL,
    `requested_type` VARCHAR(155) NOT NULL,
    `requested_volume` INT NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT current_timestamp(),
    `completed_at` TIMESTAMP,
    `cancelled_at` TIMESTAMP,
    FOREIGN KEY (`house_id`) REFERENCES house(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
-- -- -- -- -- RESOURCE -- -- -- -- --
CREATE TABLE `resource` (
    `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    `type_name` VARCHAR(155) NOT NULL,
    `volume` INT NOT NULL,
    `house_id` INT,
    `person_id` INT,
    `created_at` TIMESTAMP NOT NULL DEFAULT current_timestamp(),
    `deleted_at` TIMESTAMP,
    FOREIGN KEY (`house_id`) REFERENCES house(`id`),
    FOREIGN KEY (`person_id`) REFERENCES person(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
INSERT INTO resource (type_name, volume, house_id) VALUES ('food', 9, 2);
INSERT INTO resource (type_name, volume, house_id) VALUES ('wood', 20, 2);
INSERT INTO resource (type_name, volume, house_id) VALUES ('food', 9, 3);
INSERT INTO resource (type_name, volume, house_id) VALUES ('wood', 12, 3);
INSERT INTO resource (type_name, volume, house_id) VALUES ('food', 5, 4);
INSERT INTO resource (type_name, volume, house_id) VALUES ('wood', 8, 4);
INSERT INTO resource (type_name, volume, house_id) VALUES ('food', 9, 5);
INSERT INTO resource (type_name, volume, house_id) VALUES ('wood', 12, 5);
INSERT INTO resource (type_name, volume, house_id) VALUES ('food', 3, 6);
INSERT INTO resource (type_name, volume, house_id) VALUES ('wood', 6, 6);
INSERT INTO resource (type_name, volume, house_id) VALUES ('food', 13, 7);
INSERT INTO resource (type_name, volume, house_id) VALUES ('wood', 7, 7);
INSERT INTO resource (type_name, volume, house_id) VALUES ('food', 4, 8);
INSERT INTO resource (type_name, volume, house_id) VALUES ('wood', 5, 8);
INSERT INTO resource (type_name, volume, house_id) VALUES ('food', 2, 9);
INSERT INTO resource (type_name, volume, house_id) VALUES ('wood', 1, 9);
INSERT INTO resource (type_name, volume, house_id) VALUES ('food', 4, 11);
INSERT INTO resource (type_name, volume, house_id) VALUES ('wood', 1, 11);
INSERT INTO resource (type_name, volume, house_id) VALUES ('food', 4, 12);
INSERT INTO resource (type_name, volume, house_id) VALUES ('wood', 1, 12);
INSERT INTO resource (type_name, volume, house_id) VALUES ('food', 4, 13);
INSERT INTO resource (type_name, volume, house_id) VALUES ('wood', 1, 13);
INSERT INTO resource (type_name, volume, house_id) VALUES ('food', 4, 14);
INSERT INTO resource (type_name, volume, house_id) VALUES ('wood', 1, 14);
INSERT INTO resource (type_name, volume, house_id) VALUES ('food', 3, 15);
INSERT INTO resource (type_name, volume, house_id) VALUES ('wood', 1, 15);
INSERT INTO resource (type_name, volume, house_id) VALUES ('food', 3, 16);
INSERT INTO resource (type_name, volume, house_id) VALUES ('wood', 1, 16);
INSERT INTO resource (type_name, volume, house_id) VALUES ('food', 2, 17);
INSERT INTO resource (type_name, volume, house_id) VALUES ('wood', 1, 17);
INSERT INTO resource (type_name, volume, house_id) VALUES ('food', 0, 18);
INSERT INTO resource (type_name, volume, house_id) VALUES ('wood', 0, 18);
INSERT INTO resource (type_name, volume, house_id) VALUES ('food', 3, 19);
INSERT INTO resource (type_name, volume, house_id) VALUES ('wood', 0, 19);
INSERT INTO resource (type_name, volume, house_id) VALUES ('food', 1, 20);
INSERT INTO resource (type_name, volume, house_id) VALUES ('wood', 0, 20);
INSERT INTO resource (type_name, volume, house_id) VALUES ('food', 0, 21);
INSERT INTO resource (type_name, volume, house_id) VALUES ('wood', 0, 21);
-- -- -- -- -- MOVE HOUSE -- -- -- -- --
CREATE TABLE `move_house` (
    `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    `person_id` INT NOT NULL,
    `origin_house_id` INT NOT NULL,
    `destination_house_id` INT NOT NULL,
    `started_at` TIMESTAMP NOT NULL DEFAULT current_timestamp(),
    `completed_at` TIMESTAMP,
    `cancelled_at` TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
INSERT INTO move_house (person_id, origin_house_id, destination_house_id) VALUES (3, 2, 12);
-- -- -- -- -- PROPOSAL -- -- -- -- --
CREATE TABLE `proposal` (
    `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    `proposer_person_id` INT NOT NULL,
    `accepter_person_id` INT,
    `created_at` TIMESTAMP NOT NULL DEFAULT current_timestamp(),
    `accepted_at` TIMESTAMP,
    `cancelled_at` TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
INSERT INTO proposal (proposer_person_id) VALUES (43);