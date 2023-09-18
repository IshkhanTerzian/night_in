const express = require('express');
const cors = require('cors');
const app = express();
const conn = require('./db');
app.use(cors());
app.use(express.json());



app.post('/register', function(req, res){
    const { username, email, password } = req.body;
    console.log("Received registration request with data:", req.body);

    const sql = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
    conn.query(sql, [username, email, password], function(err, result){
        if (err) {
            console.log("Registration failed:", err);
            res.status(500).json({ error: 'Registration failed' });
        } else {
            console.log("Registration successful");
            res.json({ message: 'Registration successful' });
        }
    });
});


app.post('/login', function (req, res) {
    const { username, password } = req.body;

    const sql = "SELECT * FROM users WHERE username = ? AND password = ?";
    conn.query(sql, [username, password], function (err, result) {
        if (err) {
            console.log("Login failed:", err);
            res.status(500).json({ error: 'Login failed' });
        } else if (result.length === 1) {
            const loggedInUsername = result[0].username; // Get the username from the query result
            console.log("Login successful");
            res.json({ message: 'Login successful', username: loggedInUsername });
        } else {
            console.log("Login failed: User not found");
            res.status(401).json({ error: 'User not found' });
        }
    });
});

app.listen(3001, function(){
    console.log(`App listening on port 3001`);
    conn.connect(function (err){
        if (err) {
            console.log("SOMETHING WENT WRONG");
            console.log(err.message);
        }
        console.log("Database is connected");
    })
});
