const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const reviewRoutes = require("./api/routes/review");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.send("hello world");
});

app.use("/review", reviewRoutes);

app.use((req, res, next) => {
    const error = new Error("Not Found")
    error.status = 404;
    next(error)
});

app.use((error, req, res, next) => {
    res.status(error.status || 500)
    res.json({
        error: {
            message: error.message
        }
    });
    next(error)
});

module.exports = app;


  