const express = require('express');
const app = express();
require('dotenv').config();

app.get('/', (req, res) => {
	res.send('your request to endpoint / returned this response');
});

const port = process.env.PORT || 5001;

app.listen(port, () => {
	console.log(`Listening on port ${port}`);
});
