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
    `address_id` INT NOT NULL,
    `rooms` INT NOT NULL DEFAULT 1,
    `storage` INT NOT NULL DEFAULT 6,
    `food` INT NOT NULL DEFAULT 0,
    `wood` INT NOT NULL DEFAULT 0,
    `family_id` INT NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT current_timestamp(),
    FOREIGN KEY (`family_id`) REFERENCES family(`id`),
    FOREIGN KEY (`address_id`) REFERENCES house_address(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
CREATE TABLE `house_road` (
    `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    `road_name` VARCHAR(155) NOT NULL,
    `capacity` INT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
CREATE TABLE `house_address` (
    `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    `number` INT NOT NULL,
    `road_id` INT NOT NULL,
    FOREIGN KEY (`road_id`) REFERENCES house_road(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
CREATE TABLE `house_road_name` (
    `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(155) NOT NULL,
    `theme` VARCHAR(155) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
CREATE TABLE `house_road_type` (
    `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(155) NOT NULL,
    `capacity` INT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
-- -- -- -- -- PERSON -- -- -- -- --
CREATE TABLE `person` (
    `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(155) NOT NULL,
    `family_id` INT NOT NULL,
    `father_id` INT NOT NULL REFERENCES person,
    `mother_id` INT NOT NULL REFERENCES person,
    `partner_id` INT REFERENCES person,
    `teacher_id` INT REFERENCES person,
    `gender` VARCHAR(155) NOT NULL,
    `house_id` INT,
    `skills_id` INT NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT current_timestamp(),
    `deleted_at` TIMESTAMP,
    FOREIGN KEY (`family_id`) REFERENCES family(`id`),
    FOREIGN KEY (`house_id`) REFERENCES house(`id`),
    FOREIGN KEY (`skills_id`) REFERENCES person_skills(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
CREATE TABLE `person_name` (
    `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(155) NOT NULL,
    `gender` VARCHAR(155) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
CREATE TABLE `person_skills` (
    `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    `gatherer_experience` INT NOT NULL DEFAULT 1,
    `lumberjack_experience` INT NOT NULL DEFAULT 1,
    `builder_experience` INT NOT NULL DEFAULT 1,
    `created_at` TIMESTAMP NOT NULL DEFAULT current_timestamp(),
    `deleted_at` TIMESTAMP,
    FOREIGN KEY (`person_id`) REFERENCES person(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
-- -- -- -- -- ACTION -- -- -- -- --
CREATE TABLE `action` (
    `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    `person_id` INT NOT NULL,
    `type_id` INT NOT NULL,
    `infinite` BOOL NOT NULL DEFAULT 0,
    `started_at` TIMESTAMP NOT NULL DEFAULT current_timestamp(),
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
    `person_id` INT NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT current_timestamp(),
    `accepted_at` TIMESTAMP,
    `cancelled_at` TIMESTAMP,
    FOREIGN KEY (`person_id`) REFERENCES person(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
CREATE TABLE `proposal_offer` (
    `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    `proposal_id` INT NOT NULL,
    `person_id` INT NOT NULL,
    `dowry_id` INT NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT current_timestamp(),
    `accepted_at` TIMESTAMP,
    `deleted_at` TIMESTAMP,
    FOREIGN KEY (`proposal_id`) REFERENCES proposal(`id`),
    FOREIGN KEY (`person_id`) REFERENCES person(`id`),
    FOREIGN KEY (`dowry_id`) REFERENCES proposal_dowry(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
CREATE TABLE `proposal_dowry` (
    `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    `person_id` INT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT current_timestamp(),
    `accepted_at` TIMESTAMP,
    `deleted_at` TIMESTAMP,
    FOREIGN KEY (`person_id`) REFERENCES person(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
