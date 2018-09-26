'use strict'

const mongo = require('mongodb');

const Database = {
	db : null,
	ObjectID : mongo.ObjectID,

	connect (url) {
		return mongo.MongoClient.connect(url)
		.then(client => {
			this.db = client.db('todos');;
			return Promise.resolve();
		})
		.catch(err => console.log('An error occured while connectiong to mongo:', err));
	}
}

module.exports = Database;
