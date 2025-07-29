SELECT *
FROM users;

SELECT first_name, last_name
FROM users;

SELECT first_name AS "First name", last_name AS "Last name"
FROM users;

SELECT *
FROM users
WHERE first_name = 'Alex';

SELECT *
FROM users
WHERE age >= 23;

SELECT *
FROM users
WHERE age >= 23 AND first_name = 'Alex';

SELECT *
FROM users
WHERE email LIKE '%a%';

SELECT *
FROM pets
LIMIT 3;

SELECT *
FROM pets
LIMIT 3
OFFSET 3;

SELECT *
FROM pets
ORDER BY name DESC;

SELECT *
FROM users
ORDER BY age ASC;