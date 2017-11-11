var config = require('../../configs/config'),
	ethconfig = require('../../configs/ethConfig'),
	User   = require('../api/model'),
	dbConn = require('../../conns/dbConn'),
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
	},
	
	newContract : function(_contractName, _endTime, creatorArr){
		return new Promise(function(resolve,reject){
			console.log("Inside newContract method");
			if(global.web3 !== 'undefined'){
				console.log("web3 is not undefined, web3.eth.accounts[0] = "+ global.web3.eth.accounts[0]);
				var browser_ballot_sol_ballotContract = global.web3.eth.contract(ethconfig.abi);
				console.log("After loading the abi, After creating ballot object");
				var browser_ballot_sol_ballot = browser_ballot_sol_ballotContract.new(
					_contractName,
					_endTime,
				   {
					 from: global.web3.eth.accounts[0], 
					 data: ethconfig.byteCode, 
					 gas: ethconfig.gas
				   }, function (e, contract){
					if(e){
						reject(e);
					}else{
						if (typeof contract.address !== 'undefined') {
							console.log('Contract mined! address: ' + contract.address + ' transactionHash: ' + contract.transactionHash);
							resolve(contract.address);
					   }
					}
				});
			}
		});
	},
	
}


module.exports = services;