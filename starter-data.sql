-- -- -- -- -- RESET -- -- -- -- --
DROP TABLE person;
DROP TABLE house;
DROP TABLE family;
-- -- -- -- -- FAMILY -- -- -- -- --
CREATE TABLE `family` (
    `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(155) NOT NULL UNIQUE,
    `user_id` INT NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT current_timestamp(),
    FOREIGN KEY (`user_id`) REFERENCES user(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
-- -- -- -- -- HOUSE -- -- -- -- --
CREATE TABLE `house` (
    `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(155) NOT NULL DEFAULT 'House',
    `rooms` INT NOT NULL DEFAULT 1,
    `storage` INT NOT NULL DEFAULT 6,
    `food` INT NOT NULL DEFAULT 0,
    `wood` INT NOT NULL DEFAULT 0,
    `family_id` INT NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT current_timestamp(),
    FOREIGN KEY (`family_id`) REFERENCES family(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
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
-- -- -- -- -- USER -- -- -- -- --
CREATE TABLE `user` (
    `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(155) NOT NULL UNIQUE,
    `email` VARCHAR(155) NOT NULL UNIQUE,
    `password` VARCHAR(155) NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT current_timestamp(),
    `deleted_at` TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
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
    `volume` INT UNSIGNED NOT NULL DEFAULT 0,
    `house_id` INT,
    `person_id` INT,
    `created_at` TIMESTAMP NOT NULL DEFAULT current_timestamp(),
    `deleted_at` TIMESTAMP,
    FOREIGN KEY (`house_id`) REFERENCES house(`id`),
    FOREIGN KEY (`person_id`) REFERENCES person(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
-- -- -- -- -- MOVE HOUSE -- -- -- -- --
CREATE TABLE `move_house` (
    `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    `person_id` INT NOT NULL,
    `house_id` INT NOT NULL,
    `started_at` TIMESTAMP NOT NULL DEFAULT current_timestamp(),
    `completed_at` TIMESTAMP,
    `cancelled_at` TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
-- -- -- -- -- PROPOSAL -- -- -- -- --
CREATE TABLE `proposal` (
    `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    `proposer_person_id` INT NOT NULL,
    `accepter_person_id` INT,
    `created_at` TIMESTAMP NOT NULL DEFAULT current_timestamp(),
    `accepted_at` TIMESTAMP,
    `cancelled_at` TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
