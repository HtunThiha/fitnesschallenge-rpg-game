DROP TABLE IF EXISTS users;

CREATE TABLE users(
    user_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255)
);