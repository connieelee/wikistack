'use strict';

var express = require('express');
var app = express();
var morgan = require('morgan');
var swig = require('swig');
var bodyParser = require('body-parser');
var models = require('./models');

// swig
app.engine('html', swig.renderFile); // how to render html templates
app.set('view engine', 'html'); // what file extension do our templates have
app.set('views', process.cwd() + '/views'); // where to find the views
swig.setDefaults({ cache: false });

// logger
app.use(morgan('dev'));

// body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false }));

// static middleware
app.use(express.static(process.cwd() + '/public'));

// router
app.use('/wiki', require('./routes/wiki.js'));

// models
models.User.sync({})
.then(function () {
	return models.Page.sync({})
})
.then(function () {
	app.listen(3001, function () {
		console.log('Server is listening on port 3001');
	});
});
