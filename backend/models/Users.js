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
		// email
		if (typeof this.data.email != 'undefined') {
			if (typeof this.data.email != 'string') {
				this.data.email = '';
			}
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
		if (!validator.isEmail(this.data.email)) {
			this.errors.push('Please enter a valid email');
		}	

		// password
		if (this.data.password == '') {
			this.errors.push('You must provide a password');
		}
		if (this.data.password.length > 0 && this.data.password.length < 12) {
			this.errors.push('Password must be at least 12 characters long');
		}
		if (this.data.password.length > 100) {
			this.errors.push('Password cannot exceed 100 characters');
		}
	}

	hashPassword(password) {
		let salt = bcrypt.genSaltSync(10);
		let hashedPassword = bcrypt.hashSync(password, salt);
		this.data.password = hashedPassword;
	}

	register() {
		return new Promise(async (resolve, reject) => {
			this.cleanUp();
			this.validate();
			
			if (!this.errors.length) {
				this.hashPassword(this.data.password);
	
				const doc = this.data;
				const result = await usersCollection.insertOne(doc);		
	
				if (result) {
					resolve('Registration was successful');
				} else {
					reject('Registration was unsuccessful. Please try again.');
				}	
			} else {
				reject(this.errors);
			}
		})
	}

	login() {
		return new Promise(async (resolve, reject) => {
			this.cleanUp();

			const query = {
				username: this.data.username,
			};

			const user = await usersCollection.findOne(query);
			// console.log(JSON.stringify(user, null, '\t'));

			if (user) {
				if (bcrypt.compareSync(this.data.password, user.password)) {
					resolve(`Welcome ${user.username}!`);
				} else {
					reject('Invalid username / password');
				}
			}
		})
	}

}

module.exports = Users;
