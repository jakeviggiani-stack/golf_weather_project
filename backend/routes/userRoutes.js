const express = require('express');
const bcrypt = require('bcrypt');
const mysql = require('mysql2');

const router = express.Router();
router.get("/test", (req, res) => {
    res.json({message: "User route is working!"});
})

// Create a MYSQL connection pool
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

router.post('/signup', async (req, res) => {
    console.log("POST /api/users/signup", req.body);
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required.' });
        }

        db.query('SELECT * FROM users WHERE username = ?', [username], async (err, rows) => {
            if (err) return res.status(500).json({ message: 'Database error.' });

            if (rows.length > 0) {
                return res.status(409).json({ message: 'Username already exists.' });
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            db.query('INSERT INTO users (username, pasword_hash) VALUES (?, ?)', 
                [username, hashedPassword],
                (eer2) => {
                    if (eer2) return res.status(500).json({ message: 'Database error.' });
                    return res.status(201).json({ message: 'User created successfully.' });
                }
            );
        });
    } catch (error) {
        return res.status(500).json({ message: 'Server error.' });
    }

});
module.exports = router;

router.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password required.' });
    }

    db.query('SELECT * FROM users WHERE username = ?', [username], async (err, rows) => {
        if (err) return res.status(500).json({ message: 'Database error.' });

        if (rows.length === 0) {
            return res.status(400).json({ message: 'Invalid username or password.' });
        }

        const user = rows[0];

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid username or password.' });
        }

        return res.status(200).json({ message: 'Login successful.' });
    });
});
