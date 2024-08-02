const express = require('express');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const path = require('path');
const router = require('./routes/auth');


const port = process.env.PORT || 5000;


const app = express();

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use(cookieParser());



app.use('/api', router);





app.listen(port, () => {
    console.log(`Server is listening on http://localhost:${port}`);
});