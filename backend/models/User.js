const usersCollection = require('../db/conn').collection('users');
const validator = require('validator');

let User = function (data) {
	this.data = data;
	this.errors = [];
};

User.prototype.cleanUp = function () {
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
};

User.prototype.validate = function () {
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
	if (this.data.password.length > 100) {
		this.errors.push('Password cannot exceed 100 characters');
	}
};

User.prototype.register = async function (callback) {
	this.cleanUp();
	this.validate();

	if (!this.errors.length) {
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
};

// User.prototype.login = async function (callback) {
// 	this.cleanUp();
// 	this.validate();

// 	if (!this.errors.length) {
// 		const query = {
// 			username: this.data.username,
// 			password: this.data.password,
// 		};

// 		const result = await usersCollection.findOne(query);

// 		if (result) {
// 			callback(`Welcome ${result.username}!`);
// 		} else {
// 			callback(`Invalid username / password.`);
// 		}
// 	} else {
// 		callback(this.errors);
// 	}
// };

User.prototype.login = async function () {};
User.prototype.login = async function (callback) {
	this.cleanUp();
	this.validate();

	if (!this.errors.length) {
		const query = {
			username: this.data.username,
			password: this.data.password,
		};

		const result = await usersCollection.findOne(query);

		if (result) {
			callback(`Welcome ${result.username}!`);
		} else {
			callback(`Invalid username / password.`);
		}
	} else {
		callback(this.errors);
	}
};
module.exports = User;
