const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

let db;

// Function to handle database connection with automatic retry
const connectWithRetry = () => {
  db = mysql.createConnection({
    host: 'db',
    user: 'vulnuser',
    password: 'vulnpass',
    database: 'vulndb'
  });

  db.connect((err) => {
    if (err) {
      console.error('Database connection failed, retrying in 5 seconds:', err.message);
      setTimeout(connectWithRetry, 5000);
    } else {
      console.log('Connected to database.');
    }
  });
};

// Start connection
connectWithRetry();

// Root endpoint (for testing server availability)
app.get('/', (req, res) => {
  res.send('Backend server running!');
});

// Vulnerable login endpoint (SQL Injection)
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Intentional vulnerability (SQL Injection)
  const sql = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('SQL Error:', err.message);
      return res.status(500).json({ message: 'Server Error' });
    }

    if (results.length > 0) {
      res.json({ message: 'Login successful', user: results[0] });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  });
});

// Start Express server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
// XSS vulnerable search endpoint
app.get('/search', (req, res) => {
  const query = req.query.q || '';
  
  // Intentionally vulnerable (reflecting user input directly)
  res.send(`
    <html>
      <body>
        <h2>Search results for: ${query}</h2>
      </body>
    </html>
  `);
});
