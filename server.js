const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;
const corsOptions = {
    origin: 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204
}

// Middleware
app.use(bodyParser.json())
app.use(cors(corsOptions))
app.use(bodyParser.urlencoded({ extended: true }));

// MySQL Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'HJndezo78ZDBJ',
  database: 'garage_db'
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL Database');
});

// Routes
app.post('/api/signup', (req, res) => {
  const { lastname, firstname, email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 8);

  const sql = 'INSERT INTO users (lastname, firstname, email, password) VALUES (?, ?, ?, ?)';
  db.query(sql, [lastname, firstname, email, hashedPassword], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Server error');
      return;
    }
    res.status(201).send('User registered');
  });
});

app.post('/api/signin', (req, res) => {
  const { email, password } = req.body;

  const sql = 'SELECT * FROM users WHERE email = ?';
  db.query(sql, [email], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Server error');
      return;
    }

    if (results.length === 0) {
      res.status(404).send('User not found');
      return;
    }

    const user = results[0];
    const passwordIsValid = bcrypt.compareSync(password, user.password);

    if (!passwordIsValid) {
      res.status(401).send('Invalid password');
      return;
    }

    const token = jwt.sign(
      {
      id: user.id, 
      lastname: user.lastname,
      firstname: user.firstname,
      email: user.email
    }
      , 'top-secret-la-clé', 
      { expiresIn: 86400 });
    
    res.status(200).send({ auth: true, token });
  });
});

// Verify Token
app.get('/api/verify', (req, res) => {
  if (!req.cookies.token) {
    res.status(401).send('No token provided');
    return;
  }

  jwt.verify(token, 'top-secret-la-clé', (err, decoded_user) => {
    if (err) {
      res.status(401).send('Invalid token');
      return;
    }
    res.status(200).send(decoded_user);
  });
});

// get all clients
app.get('/api/dashboard/clients', (req, res) => {
  const sql = 'SELECT users.id, users.lastname, users.firstname, users.email FROM clients INNER JOIN users ON clients.user_id = users.id';
  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Server error');
      return;
    }
    res.status(200).json(results);
  });
});


// modify a client
app.put('/api/dashboard/clients/:userId', (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  const { role } = req.body;

  const sql = 'UPDATE clients SET role = ? WHERE user_id = ?';
  db.query(sql, [role, userId], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Server error');
      return;
    }

    if (result.affectedRows === 0) {
      res.status(404).send('Client not found');
      return;
    }

    res.status(200).send('Client updated');
  });
});


// delete a client
app.delete('/api/dashboard/clients/:userId', (req, res) => {
  const userId = parseInt(req.params.userId, 10);

  const sql = 'DELETE FROM clients WHERE user_id = ?';
  db.query(sql, [userId], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Server error');
      return;
    }

    if (result.affectedRows === 0) {
      res.status(404).send('Client not found');
      return;
    }

    res.status(200).send('Client deleted');
  });
});



app.use(express.static(path.join(__dirname, "./client/dist")))
app.get("*", (_, res) => {
    res.sendFile(
      path.join(__dirname, "./client/dist/index.html")
    )
})


// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
