var config = require('../../config'),
	User   = require('../api/model'),
	dbConn = require('../../dbConn'),
	jwt = require('jsonwebtoken');


var services = {
	getToken : function(user){
		return jwt.sign(user, config.secret , {
			expiresIn: 60*60*24
		});
	},
	
	checkExists : function(query,model){
		var OueryObj = global.dbQueryObj.collection(model);
		return new Promise(function(resolve,reject){
			OueryObj.find(query).toArray(function(err,result){
				if(err) throw err;
				if(result.length == 0) resolve(result[0]);
				else reject('Alerady Exists');
			});
		});
	},

	checkIfUserExists : function(username){
		var OueryObj = global.dbQueryObj.collection("User1");
		return new Promise(function(resolve,reject){
			var query = { username :  username };
			console.log('userController : query = '+ query);
			//Check if UserName exists 
			OueryObj.find(query).toArray(function(err,result){
				if(err) throw err;
				console.log('userController : result = '+ result.length);
				
				
				if(result.length > 0)
					resolve(result[0]);
				else
					reject('Authentication failed. User not found');
			});
		});
	},

	insertIntoDb : function(objToInsert,model){
		var OueryObj = global.dbQueryObj.collection(model);
		return new Promise(function(resolve,reject){
			OueryObj.insertOne(objToInsert, function(err, result) {
			    if (err) throw err;
			    console.log('userController : Promise1 resolved: result.insertedCount = '+ result.insertedCount);
			    if(result.insertedCount == 1)
			    	resolve('Inserted');
			    else
			    	reject(result);
				});
			});
	},

	ensureToken : function(req,res,next){
		const bearerHeader = req.headers["authorization"];
		if (typeof bearerHeader !== 'undefined') {
		  const bearer = bearerHeader.split(" ");
		  const bearerToken = bearer[1];
		  req.token = bearerToken;
		  next();
		} else {
		  res.sendStatus(403);
		}	
	}
}


module.exports = services;