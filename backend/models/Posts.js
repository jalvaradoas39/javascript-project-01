const client = require('../db/conn');
const postsCollection = client.db(process.env.DB_NAME).collection('posts');
const ObjectId = require('mongodb').ObjectId;

class Posts {
    constructor(data, userId) {
        this.data = data;
		this.userId = userId;
        this.errorMsg = [];
        this.successMsg = [];
    }

	cleanUp() {
		// title
		if (typeof this.data.title != 'string') {
			this.data.title = '';
		} else {
			this.data.title.trim();
		}

		// body
		if (typeof this.data.body != 'string') {
			this.data.body = '';
		} else {
			this.data.body.trim();
		}
	}

	validate() {
		// title
		if (this.data.title == '') {
			this.errorMsg.push('You must provide a title');
		}
		// body
		if (this.data.body == '') {
			this.errorMsg.push('You must provide body content');
		}
	}

    create() {
        this.cleanUp();
        this.validate();

        return new Promise(async (resolve, reject) => {
            const doc = {
				...this.data,
				author: new ObjectId(this.userId),
				created_on: new Date()
			}
			console.log(doc);

            if (this.errorMsg.length) return reject(this.errorMsg);
            
            try {
                const result = await postsCollection.insertOne(doc);

                resolve(result);
            } catch (err) {
				this.errorMsg.push('Please try again later');
                reject(this.errorMsg);
            }
        })
    }

}

module.exports = Posts;