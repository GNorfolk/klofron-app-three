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
INSERT INTO house (name, rooms, storage, family_id) VALUES ('Jims Parents', 4, 10, 1);
INSERT INTO house (name, rooms, storage, family_id) VALUES ('Schrute Farms', 3, 10, 2);
INSERT INTO house (name, rooms, storage, family_id) VALUES ('The Condo', 2, 10, 3);
INSERT INTO house (name, rooms, storage, family_id) VALUES ('Temps House', 3, 10, 4);
INSERT INTO house (name, rooms, storage, family_id) VALUES ('Nardville', 2, 10, 5);
INSERT INTO house (name, rooms, storage, family_id) VALUES ('The Crib', 3, 10, 6);
INSERT INTO house (name, rooms, storage, family_id) VALUES ('Refrigeration Inc', 2, 10, 7);
INSERT INTO house (name, rooms, storage, family_id) VALUES ('Florida', 3, 10, 8);
-- -- -- -- -- PERSON -- -- -- -- --
CREATE TABLE `person` (
    `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(155) NOT NULL,
    `family_id` INT NOT NULL,
    `father_id` INT NOT NULL REFERENCES person,
    `mother_id` INT NOT NULL REFERENCES person,
    `gender` VARCHAR(155) NOT NULL,
    `house_id` INT,
    `last_action` TIMESTAMP NOT NULL DEFAULT current_timestamp(),
    `created_at` TIMESTAMP NOT NULL DEFAULT current_timestamp(),
    FOREIGN KEY (`family_id`) REFERENCES family(`id`),
    FOREIGN KEY (`house_id`) REFERENCES house(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
INSERT INTO person (name, family_id, father_id, mother_id, gender, house_id, created_at) VALUES ('Jim', 1, 0, 0, 'male', 1, date_sub(now(), interval 42 day));
INSERT INTO person (name, family_id, father_id, mother_id, gender, house_id, created_at) VALUES ('Pam', 1, 0, 0, 'female', 1, date_sub(now(), interval 39 day));
INSERT INTO person (name, family_id, father_id, mother_id, gender, house_id, created_at) VALUES ('Cecelia', 1, 1, 2, 'female', 1, date_sub(now(), interval 5 day));
INSERT INTO person (name, family_id, father_id, mother_id, gender, house_id, created_at) VALUES ('Phillip', 1, 1, 2, 'male', 1, date_sub(now(), interval 2 day));
INSERT INTO person (name, family_id, father_id, mother_id, gender, house_id, created_at) VALUES ('Dwight', 2, 0, 0, 'male', 2, date_sub(now(), interval 48 day));
INSERT INTO person (name, family_id, father_id, mother_id, gender, house_id, created_at) VALUES ('Angela', 2, 0, 0, 'female', 2, date_sub(now(), interval 39 day));
INSERT INTO person (name, family_id, father_id, mother_id, gender, house_id, created_at) VALUES ('Philip', 2, 5, 6, 'male', 2, date_sub(now(), interval 2 day));
INSERT INTO person (name, family_id, father_id, mother_id, gender, house_id, created_at) VALUES ('Michael', 3, 0, 0, 'male', 3, date_sub(now(), interval 58 day));
INSERT INTO person (name, family_id, father_id, mother_id, gender, house_id, created_at) VALUES ('Holly', 3, 0, 0, 'female', 3, date_sub(now(), interval 51 day));
INSERT INTO person (name, family_id, father_id, mother_id, gender, house_id, created_at) VALUES ('Ryan', 4, 0, 0, 'male', 4, date_sub(now(), interval 43 day));
INSERT INTO person (name, family_id, father_id, mother_id, gender, house_id, created_at) VALUES ('Kelly', 4, 0, 0, 'female', 4, date_sub(now(), interval 43 day));
INSERT INTO person (name, family_id, father_id, mother_id, gender, house_id, created_at) VALUES ('Drake', 4, 10, 11, 'male', 4, date_sub(now(), interval 8 day));
INSERT INTO person (name, family_id, father_id, mother_id, gender, house_id, created_at) VALUES ('Andy', 5, 0, 0, 'male', 5, date_sub(now(), interval 50 day));
INSERT INTO person (name, family_id, father_id, mother_id, gender, house_id, created_at) VALUES ('Erin', 5, 0, 0, 'female', 5, date_sub(now(), interval 36 day));
INSERT INTO person (name, family_id, father_id, mother_id, gender, house_id, created_at) VALUES ('Darryl', 6, 0, 0, 'male', 6, date_sub(now(), interval 51 day));
INSERT INTO person (name, family_id, father_id, mother_id, gender, house_id, created_at) VALUES ('Val', 6, 0, 0, 'female', 6, date_sub(now(), interval 46 day));
INSERT INTO person (name, family_id, father_id, mother_id, gender, house_id, created_at) VALUES ('Jada', 6, 15, 16, 'female', 6, date_sub(now(), interval 9 day));
INSERT INTO person (name, family_id, father_id, mother_id, gender, house_id, created_at) VALUES ('Bob', 7, 0, 0, 'male', 7, date_sub(now(), interval 57 day));
INSERT INTO person (name, family_id, father_id, mother_id, gender, house_id, created_at) VALUES ('Phyllis', 7, 0, 0, 'female', 7, date_sub(now(), interval 57 day));
INSERT INTO person (name, family_id, father_id, mother_id, gender, house_id, created_at) VALUES ('Stanley', 8, 0, 0, 'male', 8, date_sub(now(), interval 71 day));
INSERT INTO person (name, family_id, father_id, mother_id, gender, house_id, created_at) VALUES ('Cynthia', 8, 0, 0, 'female', 8, date_sub(now(), interval 58 day));
INSERT INTO person (name, family_id, father_id, mother_id, gender, house_id, created_at) VALUES ('Melissa', 8, 20, 21, 'female', 8, date_sub(now(), interval 24 day));