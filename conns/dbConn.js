var	config = require('../configs/config');
var mongoClient = require('mongodb').MongoClient;


var DbConnection = function (){
	return new Promise(function(resolve,reject){
		mongoClient.connect(config.database, function(err, db) {
		   if(err) reject(err);
		   else{
		   	//resolve(db.collection(config.databaseName));
		   	resolve(db);
		   }
		});
	});
}

module.exports.connection = DbConnection;