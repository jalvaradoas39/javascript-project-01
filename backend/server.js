const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const app = express();
const router = require('./routes/router');

let sessionOptions = session({
	secret: 'The more I learn the more I realize how much I do not know Einstein',
	store: MongoStore.create({
		mongoUrl: process.env.ATLAS_URI,
		dbName: process.env.DB_NAME,
	}),
	resave: false,
	saveUninitialized: false,
	cookie: { maxAge: 1000 * 60 * 60 * 24, httpOnly: true },
});

app.use(sessionOptions);
app.use(flash());
// (modern form submission) parses incoming requests with JSON payloads then appends to req.body object
app.use(express.json());
// (traditional form submission) parses incoming requests with URL-encoded payloads then appends to req.body object
app.use(express.urlencoded({ extended: false }));
// serves static assets such as HTML files, images, etc.
app.use(express.static('../frontend/public'));

// setup template engine
app.set('views', './views');
app.set('view engine', 'ejs');

// api routes
app.use('/', router);

module.exports = app;
