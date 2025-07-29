CREATE TABLE users(
    id SERIAL PRIMARY KEY, -- SERIAL = INT
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    age INT NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE pets(
    id SERIAL PRIMARY KEY,
    name VARCHAR(30) NOT NULL,
    species VARCHAR(30) NOT NULL,
    breed VARCHAR(30) NOT NULL,
    user_id INT,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE intermediary(
    user_id INT,
    pet_id INT,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY(pets_id) REFERENCES pets(id) ON DELETE CASCADE,
    PRIMARY KEY(user_id, pet_id)
);