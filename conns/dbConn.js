var	config = require('../configs/config');
var mongoClient = require('mongodb').MongoClient;


var DbConnection = function (){
	return new Promise(function(resolve,reject){
		console.log('dbConn :: Before calling mongoClient.connect()');
		mongoClient.connect(config.database, function(err, db) {
		   if(err){
			console.log('dbConn :: Promise rejected, error = ' + err);
			reject(err);
		   } 
		   else{
			console.log('dbConn :: Promise resolved');
		   	//resolve(db.collection(config.databaseName));
		   	resolve(db);
		   }
		});
	});
}

module.exports.connection = DbConnection;