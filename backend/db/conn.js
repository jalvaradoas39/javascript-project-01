const { MongoClient } = require('mongodb');
require('dotenv').config();

const client = new MongoClient(process.env.ATLAS_URI);

async function init() {
	await client.connect();
	module.exports = client.db(process.env.DB_NAME);
	console.log('Successfully connected to database');

	// listen for incoming http requests after database connection established
	const port = process.env.PORT || 5001;
	const app = require('../server');

	app.listen(port, () => {
		console.log(`Listening on port ${port}`);
	});
}

init();
