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

//This section handles user signup
router.post('/signup', async (req, res) => {
    console.log("POST /api/users/signup", req.body);
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required.' });
        }

        db.query('SELECT user_id FROM users WHERE username = ?', [username], async (err, rows) => {
            if (err) {
                console.error('Error checking existing user:', err);
                return res.status(500).json({ message: 'Database error.' });
            }

            if (rows.length > 0) {
                return res.status(409).json({ message: 'Username already exists.' });
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            db.query('INSERT INTO users (username, pasword_hash) VALUES (?, ?)', 
                [username, hashedPassword],
                (err2, result) => {
                    if (err2) {
                        console.error('Error creating user:', err2);
                        return res.status(500).json({ message: 'Database error.' });
                    }
                    return res.status(201).json({ message: 'User created successfully.', user_id: result.insertId });
                }
            );
        });
    } catch (error) {
        console.error('Error during signup:', error);
        return res.status(500).json({ message: 'Server error.' });
    }

});

//This section handles user login
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

        const isMatch = await bcrypt.compare(password, user.pasword_hash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid username or password.' });
        }

        return res.status(200).json({ message: 'Login successful.', user_id: user.user_id

         });
    });
});

//This section handles saving user preferences
router.post('/preferences', (req, res) => {
    const { user_id, temp_pref, wind_pref, humidity_pref } = req.body;

    if (!user_id || !temp_pref || !wind_pref || !humidity_pref) {
        return res.status(400).json({ message: 'All preferences are required.' });
    }

        const query = "INSERT INTO preferences (user_id, temp_pref, wind_pref, humidity_pref) VALUES (?, ?, ?, ?)";
        db.query(query, [user_id, temp_pref, wind_pref, humidity_pref], (err2, result) => {
            if (err2) {
                console.log('Error saving preferences:', err2);
                return res.status(500).json({ message: 'Database error.' });
            }

            return res.status(201).json({ message: 'Preferences saved successfully.' });
        });
    });

//This section handles saving users favorite courses
router.post('/courses', (req, res) => {
    const { user_id, course_ids } = req.body;


    if (!user_id || !course_ids || !Array.isArray(course_ids) || course_ids.length === 0) {
        return res.status(400).json({ message: 'User ID and Course IDs are required.' });
    }

    const query = "INSERT INTO favorites (user_id, course_id) VALUES ?";
    const values = course_ids.map(course_id => [user_id, course_id]);

    db.query(query, [values], (err, result) => {
        if (err) {
            console.error('Error saving courses:', err);
            return res.status(500).json({ message: 'Database error.' });
        }

        return res.status(201).json({ message: 'Courses saved successfully.' });
    });
});

//This section handles fetching available courses
router.get('/courses', (req, res) => {
    const query = "SELECT course_id, course_name FROM courses";

    db.query(query, (err, rows) => {
        if (err) {
            console.error('Error fetching courses:', err);
            return res.status(500).json({ message: 'Database error.' });
        }
        res.json(rows);
    });
});