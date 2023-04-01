const { MongoClient } = require('mongodb');
require('dotenv').config();

const client = new MongoClient(process.env.ATLAS_URI);

async function init() {
	await client.connect();
	module.exports = client;
	console.log('Successfully connected to database');

	// listen for incoming http requests after database connection established
	const port = process.env.PORT || process.env.PORT_ALTERNATIVE;
	const app = require('../server');

	app.listen(port, () => {
		console.log(`Listening on port ${port}`);
	});
}

init();
