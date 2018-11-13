var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var routes = require('./routes/api');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api', routes);

module.exports = app;
