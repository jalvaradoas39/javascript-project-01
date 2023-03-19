const express = require('express');
const app = express();
require('dotenv').config();
const router = require('./routes/router');

// setup static files (css, js)
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
