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
    `name` VARCHAR(155) NOT NULL,
    `rooms` INT NOT NULL,
    `storage` INT NOT NULL,
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
INSERT INTO house (name, rooms, storage, family_id) VALUES ('The Crib', 3, 12, 7);
INSERT INTO house (name, rooms, storage, family_id) VALUES ('Refrigeration Inc', 2, 12, 8);
INSERT INTO house (name, rooms, storage, family_id) VALUES ('Florida', 3, 12, 9);
-- -- -- -- -- PERSON -- -- -- -- --
CREATE TABLE `person` (
    `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(155) NOT NULL,
    `family_id` INT NOT NULL,
    `father_id` INT NOT NULL REFERENCES person,
    `mother_id` INT NOT NULL REFERENCES person,
    `gender` VARCHAR(155) NOT NULL,
    `house_id` INT,
    `created_at` TIMESTAMP NOT NULL DEFAULT current_timestamp(),
    `deleted_at` TIMESTAMP,
    FOREIGN KEY (`family_id`) REFERENCES family(`id`),
    FOREIGN KEY (`house_id`) REFERENCES house(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
INSERT INTO person (name, family_id, father_id, mother_id, gender, house_id, created_at) VALUES ('Adam', 1, 1, 2, 'male', 1, date_sub(now(), interval 6000 day));
INSERT INTO person (name, family_id, father_id, mother_id, gender, house_id, created_at) VALUES ('Eve', 1, 1, 2, 'female', 1, date_sub(now(), interval 6000 day));
INSERT INTO person (name, family_id, father_id, mother_id, gender, house_id, created_at) VALUES ('Jim', 2, 1, 2, 'male', 2, date_sub(now(), interval 42 day));
INSERT INTO person (name, family_id, father_id, mother_id, gender, house_id, created_at) VALUES ('Pam', 2, 1, 2, 'female', 2, date_sub(now(), interval 39 day));
INSERT INTO person (name, family_id, father_id, mother_id, gender, house_id, created_at) VALUES ('Cecelia', 2, 3, 4, 'female', 2, date_sub(now(), interval 5 day));
INSERT INTO person (name, family_id, father_id, mother_id, gender, house_id, created_at) VALUES ('Phillip', 2, 3, 4, 'male', 2, date_sub(now(), interval 2 day));
INSERT INTO person (name, family_id, father_id, mother_id, gender, house_id, created_at) VALUES ('Dwight', 3, 1, 2, 'male', 3, date_sub(now(), interval 48 day));
INSERT INTO person (name, family_id, father_id, mother_id, gender, house_id, created_at) VALUES ('Angela', 3, 1, 2, 'female', 3, date_sub(now(), interval 39 day));
INSERT INTO person (name, family_id, father_id, mother_id, gender, house_id, created_at) VALUES ('Philip', 3, 7, 8, 'male', 3, date_sub(now(), interval 2 day));
INSERT INTO person (name, family_id, father_id, mother_id, gender, house_id, created_at) VALUES ('Michael', 4, 1, 2, 'male', 4, date_sub(now(), interval 58 day));
INSERT INTO person (name, family_id, father_id, mother_id, gender, house_id, created_at) VALUES ('Holly', 4, 1, 2, 'female', 4, date_sub(now(), interval 51 day));
INSERT INTO person (name, family_id, father_id, mother_id, gender, house_id, created_at) VALUES ('Ryan', 5, 1, 2, 'male', 5, date_sub(now(), interval 43 day));
INSERT INTO person (name, family_id, father_id, mother_id, gender, house_id, created_at) VALUES ('Kelly', 5, 1, 2, 'female', 5, date_sub(now(), interval 43 day));
INSERT INTO person (name, family_id, father_id, mother_id, gender, house_id, created_at) VALUES ('Drake', 5, 12, 13, 'male', 5, date_sub(now(), interval 8 day));
INSERT INTO person (name, family_id, father_id, mother_id, gender, house_id, created_at) VALUES ('Andy', 6, 1, 2, 'male', 6, date_sub(now(), interval 50 day));
INSERT INTO person (name, family_id, father_id, mother_id, gender, house_id, created_at) VALUES ('Erin', 6, 1, 2, 'female', 6, date_sub(now(), interval 36 day));
INSERT INTO person (name, family_id, father_id, mother_id, gender, house_id, created_at) VALUES ('Darryl', 7, 1, 2, 'male', 7, date_sub(now(), interval 51 day));
INSERT INTO person (name, family_id, father_id, mother_id, gender, house_id, created_at) VALUES ('Val', 7, 1, 2, 'female', 7, date_sub(now(), interval 46 day));
INSERT INTO person (name, family_id, father_id, mother_id, gender, house_id, created_at) VALUES ('Jada', 7, 17, 18, 'female', 7, date_sub(now(), interval 9 day));
INSERT INTO person (name, family_id, father_id, mother_id, gender, house_id, created_at) VALUES ('Bob', 8, 1, 2, 'male', 8, date_sub(now(), interval 57 day));
INSERT INTO person (name, family_id, father_id, mother_id, gender, house_id, created_at) VALUES ('Phyllis', 8, 1, 2, 'female', 8, date_sub(now(), interval 57 day));
INSERT INTO person (name, family_id, father_id, mother_id, gender, house_id, created_at) VALUES ('Stanley', 9, 1, 2, 'male', 9, date_sub(now(), interval 71 day));
INSERT INTO person (name, family_id, father_id, mother_id, gender, house_id, created_at) VALUES ('Cynthia', 9, 1, 2, 'female', 9, date_sub(now(), interval 58 day));
INSERT INTO person (name, family_id, father_id, mother_id, gender, house_id, created_at) VALUES ('Melissa', 9, 22, 23, 'female', 9, date_sub(now(), interval 24 day));
-- -- -- -- -- ACTION -- -- -- -- --
CREATE TABLE `action` (
    `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    `person_id` INT NOT NULL,
    `type_id` INT NOT NULL,
    `started_at` TIMESTAMP,
    `completed_at` TIMESTAMP,
    `cancelled_at` TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
INSERT INTO action (person_id, type_id, started_at) VALUES (3, 0, NOW());