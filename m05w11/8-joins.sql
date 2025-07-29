SELECT *
FROM users JOIN pets
    ON users.id = pets.user_id;

SELECT u.first_name, u.last_name, p.name
FROM users u JOIN pets p
    ON u.id = p.user_id
WHERE u.id = 1;

SELECT CONCAT(u.first_name, ' ', u.last_name) AS "Owner", p.name
FROM users u JOIN pets p
    ON u.id = p.user_id
WHERE u.id = 1;

SELECT CONCAT(u.first_name, ' ', u.last_name) AS "Owner", UPPER(p.name)
FROM users u JOIN pets p
    ON u.id = p.user_id;

SELECT CONCAT(u.first_name, ' ', u.last_name) AS "Owner", COUNT(u.id) AS "Pets"
FROM users u JOIN pets p
    ON u.id = p.user_id
GROUP BY u.id;