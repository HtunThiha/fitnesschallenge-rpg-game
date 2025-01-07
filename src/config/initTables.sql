SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS challenges;
DROP TABLE IF EXISTS user_challenge_completions;
DROP TABLE IF EXISTS user_challenge_frequency;
DROP TABLE IF EXISTS user_inbox;

CREATE TABLE users(
    user_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255),
    skillpoints INT DEFAULT 0,
    gold INT DEFAULT 0,
    diamond INT DEFAULT 0,
    level INT DEFAULT 1,
    password VARCHAR(255),
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE challenges(
    challenge_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    creator_id INT NOT NULL,
    challenge VARCHAR(255),
    skillpoints INT NOT NULL,
    is_active BOOLEAN DEFAULT 0,
    votes INT DEFAULT 0,
    FOREIGN KEY(creator_id) REFERENCES users(user_id)
);

CREATE TABLE user_challenge_completions(
    completion_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    challenge_id INT NOT NULL,
    completed_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(user_id),
    FOREIGN KEY(challenge_id) REFERENCES challenges(challenge_id)
);

CREATE TABLE user_challenge_frequency(
    user_id INT NOT NULL,
    challenge_id INT NOT NULL,
    frequency INT DEFAULT 0,
    last_played_on TIMESTAMP,
    PRIMARY KEY(user_id, challenge_id),
    FOREIGN KEY(user_id) REFERENCES users(user_id),
    FOREIGN KEY(challenge_id) REFERENCES challenges(challenge_id)
);

CREATE TABLE user_inbox(
    message_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status ENUM("read", "unread") DEFAULT "unread",
    received_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(user_id)
);

INSERT INTO users(username, password)
VALUES
    ("ADMIN", "QHMgFUjCR6689@#^%"),
    ("Steve", "Helloworld2277"),
    ("Sally", "LifeisSpice09");

INSERT INTO challenges(creator_id, challenge, skillpoints, is_active)
VALUES
    (1, "Complete 2.4km within 15 minutes", 50, 1),
    (1, "Cycle around the island for at least 50km", 100, 1),
    (1, "Complete a full marathon (42.2km)", 200, 1),
    (1, "Hold a plank for 5 minutes", 50, 1),
    (1, "Perform 100 push-ups in one session", 75, 1);

INSERT INTO user_challenge_frequency(user_id, challenge_id)
VALUES
    (2, 1),
    (2, 2),
    (2, 3),
    (2, 4),
    (2, 5),
    (3, 1),
    (3, 2),
    (3, 3),
    (3, 4),
    (3, 5);

SET FOREIGN_KEY_CHECKS = 1;