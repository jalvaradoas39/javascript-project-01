const client = require('../db/conn');
const usersCollection = client.db(process.env.DB_NAME).collection('users');
const validator = require('validator');
const bcrypt = require('bcryptjs');

class Users {
	constructor(data) {
		this.data = data;
		this.errors = [];
	}

	cleanUp() {
		// username
		if (typeof this.data.username != 'string') {
			this.data.username = '';
		}
		this.data.username.trim().toLowerCase();

		// email
		if (this.data.email !== undefined) {
			if (typeof this.data.email != 'string') {
				console.log('inside double if');
				this.data.email = '';
			}
			this.data.email.trim().toLowerCase();
		}

		// password
		if (typeof this.data.password != 'string') {
			this.data.password = '';
		}
	}

	validate() {
		// username
		if (this.data.username == '') {
			this.errors.push('You must provide a username');
		}
		if (
			this.data.username != '' &&
			!validator.isAlphanumeric(this.data.username)
		) {
			this.errors.push('Username can only contain letters and numbers');
		}
		if (this.data.username.length > 0 && this.data.username.length < 3) {
			this.errors.push('Username must be at least 3 characters long');
		}

		// email
		if (this.data.email !== undefined) {
			if (!validator.isEmail(this.data.email)) {
				this.errors.push('Please enter a valid email');
			}
		}

		// password
		if (this.data.password == '') {
			this.errors.push('You must provide a password');
		}
		if (this.data.password.length > 30) {
			this.errors.push('Username cannot exceed 30 characters');
		}
		if (this.data.password.length > 0 && this.data.password.length < 12) {
			this.errors.push('Password must be at least 12 characters long');
		}
		if (this.data.password.length > 50) {
			this.errors.push('Password cannot exceed 50 characters');
		}
	}

	async register(callback) {
		this.cleanUp();
		this.validate();

		if (!this.errors.length) {
			let salt = bcrypt.genSaltSync(10);
			let hashedPassword = bcrypt.hashSync(this.data.password, salt);
			this.data.password = hashedPassword;

			const doc = this.data;

			const result = await usersCollection.insertOne(doc);

			if (result) {
				callback(
					`Registration was successful. Please login <a href='/'>here</a>`
				);
			} else {
				callback(
					'There was a problem registering. Please try again later.'
				);
			}
		} else {
			callback(this.errors);
		}
	}

	async login(callback) {
		this.cleanUp();
		this.validate();

		if (!this.errors.length) {
			const query = {
				username: this.data.username,
			};

			const user = await usersCollection.findOne(query);

			if (user) {
				if (bcrypt.compareSync(this.data.password, user.password)) {
					callback(`Welcome ${user.username}!`);
				} else {
					callback(`Invalid username / password.`);
				}
			}
		} else {
			callback(this.errors);
		}
	}
}

module.exports = Users;
