const express = require('express');
const app = express();
require('dotenv').config();
const router = require('./routes/router');

// note: app.use() registers a middleware callback that is part of the request handler chain
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

// setup server connection to listen for incoming requests
const port = process.env.PORT || 5001;

app.listen(port, () => {
	console.log(`Listening on port ${port}`);
});
