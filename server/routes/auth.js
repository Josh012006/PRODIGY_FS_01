const router = require('express').Router();
const jwt = require('jsonwebtoken');
require('dotenv').config();

const pool = require('../db/connection');
const upload = require('../utils/multerConfig');
const { hashPassword, verifyPassword } = require('../utils/managePassword');


router.get('/logout', async (req, res) => {
    try {

        res.clearCookie('token');
        res.status(200).json({ message: "Logged out successfully" });

    } catch (error) {

        console.log(error);
        res.status(500).json({ message: "Internal server error" });

    }

});

router.post('/register', upload.single('picture'), async (req, res) => {
    try {
        // Get the infos
        const { username, name, email, password, phone, address, sex, dateOfBirth } = await req.body;
        // Get the file
        const file = await req.file;

        const hashedPassword = await hashPassword(password);

        // Check if the user already exists
        await pool.query('SELECT * FROM users WHERE email = ?', [email], async (error, results) => {
            if (error) {
                console.log(error);
                res.status(500).json({ message: "Internal server error" });
            }

            if (results.length > 0) {
                res.status(409).json({ message: "User already exists" });
            } else {
                // Save the user to the database
                pool.query('INSERT INTO users (username, name, email, password, phone, address, sex, dateOfBirth, fileName) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [username, name, email, hashedPassword, phone, address, sex, dateOfBirth, file.filename], async (error, results) => {
                    if (error) {
                        console.log(error);
                        res.status(500).json({ message: "Internal server error" });
                    }

                    //Create a token and a cookie
                    const user = {
                        username, 
                        name, 
                        email, 
                        password: hashedPassword, 
                        phone, 
                        address, 
                        sex, 
                        dateOfBirth, 
                        fileName: file.filename
                    }

                    const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "1h" });
                    res.cookie('token', token, { httpOnly: true, sameSite: "strict" });

                    res.status(201).json({ message: "User registered successfully" });
                });

            }
        });


    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
});


router.post('/login', upload.none(), async (req, res) => {
    try {
        // Get the infos
        const { email, password } = await req.body;

        console.log(req.body);

        // Check if the user exists
        pool.query('SELECT * FROM users WHERE email = ?', [email], async (error, results) => {
            if (error) {
                console.log(error);
                res.status(500).json({ message: "Internal server error" });
            }

            if (results.length === 0) {
                res.status(404).json({ message: "User not found" });
            } else {
                // Verify the password
                const user = results[0];
                if (await verifyPassword(password, user.password)) {
                    //Create a token and a cookie
                    const token = jwt.sign({ ...user }, process.env.JWT_SECRET, { expiresIn: "1h" });
                    res.cookie('token', token, { httpOnly: true, sameSite: "strict" });

                    res.status(200).json({ message: "User logged in successfully" });
                } else {
                    console.log("Invalid credentials");
                    console.log(password, user.password);
                    res.status(404).json({ message: "Invalid credentials" });
                }
            }
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
});


router.get('/fetchInfos', async (req, res) => {
    try {
        // Get the user from the token
        const token = await req.cookies.token;
        
        if (!token) {
            res.status(401).json({ message: "Unauthorized" });
        } else {
            const user = jwt.verify(token, process.env.JWT_SECRET);
            res.status(200).json(user);
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
});








module.exports = router;