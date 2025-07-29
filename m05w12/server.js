// REQUIREMENTS
require('dotenv').config()
const express = require('express');
const morgan = require('morgan');
const { Pool } = require('pg')

// const dbNotes = {
//   1: {
//     id: 1,
//     content: 'Watch toy story',
//   },
//   2: {
//     id: 2,
//     content: 'Read harry potter',
//   },
//   3: {
//     id: 3,
//     content: 'Learn javascript',
//   },
// };

// SETUP AND MIDDLEWARES
const app = express();
const port = 3000;

// db setup
const db = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false,
  },
})

// db connect
db.query('SELECT NOW()')
  .then(() => console.log('Database connected!'))
  .catch(err => console.log(err) && res.send('Server error'))

// functions to create tables and seed initial data
const runSchemas = () => {
  const schemaQuery = `
  DROP TABLE IF EXISTS notes CASCADE;
  CREATE TABLE notes(
      id SERIAL PRIMARY KEY,
      content TEXT NOT NULL
  );
  `
  return db.query(schemaQuery)
    .then(() => console.log('Tables created'))
}

const runSeeds = () => {
  const seedsQuery = `
  INSERT INTO notes(content)
  VALUES ('Watch toy story'),
        ('Read harry potter'),
        ('Learn javascript');
  `
  return db.query(seedsQuery)
    .then(() => console.log('Seeds created'))
}

// returns a promise when finished the db reset
const resetDb = () => {
  return runSchemas()
    .then(() => runSeeds())
    .then(() => console.log('Database reset!'))
}

// creating custo middleware through req, res and next
// app.use((req, res, next) => {
//   console.log(req.url, req.method);
//   next();
// });

// external middlewares
app.use(morgan('dev')); // to log every request
app.set('view engine', 'ejs'); // to set templates view engine (ejs)
app.use(express.urlencoded({ extended: false })); // to allow parsing a body from request (req.body)

// ROUTES / ENDPOINTS
app.get('/', (req, res) => {
  res.send('Hello!');
});

app.get('/test', (req, res) => {
  res.send('test');
});

// RENDERING ROUTES
// List notes
app.get('/notes', (req, res) => {
  db.query(`SELECT * FROM notes;`)
    .then((response) => {
      const templateVars = {
        notes: response.rows,
      };
      res.render('notes/index', templateVars);
    })
    .catch(err => console.log(err) && res.send('Server error'))
});

// New note
app.get('/notes/new', (req, res) => {
  res.render('notes/new');
});

// Show note
app.get('/notes/:id', (req, res) => {
  db.query(`SELECT * FROM notes WHERE id = $1;`, [req.params.id])
    .then((response) => {
      const templateVars = {
        note: response.rows[0],
      };
      res.render('notes/show', templateVars);
    })
    .catch(err => console.log(err) && res.send('Server error'))
});

// CRUD API NOTES
// Create note - POST
app.post('/api/notes', (req, res) => {
  const { content } = req.body;
  
  // const id = Math.floor(Math.random() * 100);
  // dbNotes[id] = {
  //   id,
  //   content,
  // };

  db.query(`INSERT INTO notes(content) VALUES ($1) RETURNING *;`, [content])
    .then((response) => {
      res.redirect(`/notes/${response.rows[0].id}`);
    })
    .catch(err => console.log(err) && res.send('Server error'))
});

// Read all notes - GET
app.get('/api/notes', (req, res) => {
  db.query(`SELECT * FROM notes;`)
    .then((response) => {
      res.send(response.rows);
    })
    .catch(err => console.log(err) && res.send('Server error'))
});

// Read one note - GET
app.get('/api/notes/:id', (req, res) => {
  db.query(`SELECT * FROM notes WHERE id = $1;`, [req.params.id])
    .then((response) => {
      res.send(response.rows[0]);
    })
    .catch(err => console.log(err) && res.send('Server error'))
});

// Update note - POST/PUT
app.post('/api/notes/:id/edit', (req, res) => {
  const { content } = req.body;

  // dbNotes[req.params.id].content = content;

  db.query(`UPDATE notes SET content = $1 WHERE id = $2 RETURNING *;`, [content, req.params.id])
    .then((response) => {
      res.redirect(`/notes/${response.rows[0].id}`);
    })
    .catch(err => console.log(err) && res.send('Server error'))
});

// Delete note - POST/DEL
app.post('/api/notes/:id/delete', (req, res) => {
  // delete dbNotes[req.params.id];

  db.query(`DELETE FROM notes WHERE id = $1;`, [req.params.id])
    .then(() => {
      res.redirect(`/notes`);
    })
    .catch(err => console.log(err) && res.send('Server error'))
});

// extra route to reset db on demand via http get request
app.get('/api/reset', (req, res) => {
  resetDb()
    .then(() => res.send('Database reset!'))
    .catch(err => console.log(err) && res.send('Server error'))
});

// Catch all route
app.use((req, res) => {
  res.send('Not found');
});

// LISTENER
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});