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

	emailAlreadyExist(userEmail) {
		const doc = { email: this.data.email };

		return usersCollection.findOne(doc);
	}

	register() {
		return new Promise(async (resolve, reject) => {
			this.cleanUp();
			this.validate();
			
			if (!this.errors.length) {
				this.hashPassword(this.data.password);

				if (await this.emailAlreadyExist(this.data.email)) {
					this.errors.push('Email address already exists');
					reject(this.errors);
				} else {
					const doc = this.data;
					const result = await usersCollection.insertOne(doc);		
		
					if (result) {
						resolve('Registration was successful');
					} else {
						this.errors.push('Registration was unsuccessful. Please try again.');
						reject(this.errors);
					}	
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

			if (user) {
				if (bcrypt.compareSync(this.data.password, user.password)) {
					resolve(`Welcome ${user.username}!`);
				} else {
					this.errors.push('Invalid username / password1');
					reject(this.errors);
				}
			} else {
				this.errors.push('Invalid username / password2');
				reject(this.errors);
			}
		})
	}

}

module.exports = Users;
