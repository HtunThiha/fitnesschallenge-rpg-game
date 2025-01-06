const express = require('express');
const mainRoute = require('./routes/mainRoute.js');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.get('/', (req, res) => {
    res.send("hello world");
});

app.use('/', mainRoute);

module.exports = app;