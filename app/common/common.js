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
	
	newContract : function(_contractName, _endTime, _partyNames){
		return new Promise(function(resolve,reject){
			console.log("Inside newContract method");
			if(global.web3 !== 'undefined'){
				console.log("web3 is not undefined, web3.eth.accounts[0] = "+ global.web3.eth.accounts[0]);
				var browser_ballot_sol_ballotContract = global.web3.eth.contract(ethconfig.abi);
				console.log("After loading the abi, After creating ballot object");
				var browser_ballot_sol_ballot = browser_ballot_sol_ballotContract.new(
					_contractName,
					_endTime,
					_partyNames,
				   {
					 from: global.web3.eth.accounts[0], 
					 data: ethconfig.byteCode, 
					 gas: ethconfig.gas,
				   }, function (e, contract){
					if(e){
						console.log('Contract mined! error = ', e);
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

	unlockAccount : function(){
		return new Promise(function(resolve,reject){
			console.log("Inside unlockAccount method");
			if(global.web3 !== 'undefined'){
				var web3 = global.web3;
				var accountAddr  = web3.eth.accounts[0];
				var password =  ethconfig.passKey;
				web3.personal.unlockAccount(accountAddr,password, function(error, result){
					if(error){
						console.log("unlockAccount ,  error = ", error);
						reject(error);
					}else{
						console.log("unlockAccount ,  result = ", result);
						resolve(result);
					}
				});
			}
		});
	},

	addParty : function(_partyName, _contractAddr){
		return new Promise(function(resolve,reject){
			console.log("Inside addParty method");
			if(global.web3 !== 'undefined'){
				console.log("global web3 is defined");
				console.log("Before calling createContractInstance() ");
				var contractInstance = createContractInstance(_contractAddr);
				console.log("After calling createContractInstance() contractInstance :" +  contractInstance.addParty());
				// contractInstance.addParty(_partyName,{from: global.web3.eth.accounts[0]}, function(error, result){
				// 	if(error){
				// 		console.log("addParty, error = ", error);
				// 		reject(error);
				// 	}else{
				// 		console.log("addParty, result = ", result);
				// 		resolve(result);
				// 	}
				// });
				console.log("addParty, result =");
				contractInstance.addParty.sendTransaction(_partyName, {from: global.web3.eth.accounts[0], gas : ethconfig.gas}, function(e,r) {
					console.log("addParty, err =" + e);
					console.log("addParty, result =" + r);
				});
				//resolve(tx);
			}
		});
	},

	addVoter : function(_adharNumber,_contractAddr){
		return new Promise(function(resolve,reject){
			console.log("Inside newContract method");
			if(global.web3 !== 'undefined'){
				console.log("global web3 is defined");
				console.log("Before calling createContractInstance() ");
				var contractInstance = createContractInstance(_contractAddr);
				console.log("After calling createContractInstance() contractInstance :" +  contractInstance);
				var tx = contractInstance.addVoter.call(_adharNumber);
				resolve(tx);
			}
		});
	},

	validateVoter : function(_adharNumber,_contractAddr){
		return new Promise(function(resolve,reject){
			console.log("Inside validateVoter method");
			if(global.web3 !== 'undefined'){
				console.log("global web3 is defined");
				console.log("Before calling createContractInstance() ");
				var contractInstance = createContractInstance(_contractAddr);
				console.log("After calling createContractInstance() contractInstance :" +  contractInstance);
				contractInstance.validateBallotVoter.call(_adharNumber, function(error,result){
                    if(error){
						console.log("validateVoter error :" +  error);
						reject(error);
					}else{
						console.log("validateVoter result :" +  result);
						resolve(JSON.stringify(result));
					}
                });
				
			}
		});
	},

	getListOfParties : function(_contractAddr){
		return new Promise(function(resolve,reject){
			console.log("Inside getListOfParties method");
			if(global.web3 !== 'undefined'){
				console.log("global web3 is defined");
				console.log("Before calling createContractInstance() ");
				var contractInstance = createContractInstance(_contractAddr);
				console.log("After calling createContractInstance() contractInstance :" +  contractInstance);
				contractInstance.getListOfParties.call({}, function(error,result){
                    if(error){
						console.log("getListOfParties,  error :" +  error);
						reject(error);
					}else{
						console.log("getListOfParties, result :" +  result);
						resolve(JSON.stringify(result));
					}
                });
			}
		});
	},

	getPartyVoteCount : function(_partyId,_contractAddr){
		return new Promise(function(resolve,reject){
			console.log("Inside newContract method");
			if(global.web3 !== 'undefined'){
				console.log("global web3 is defined");
				console.log("Before calling createContractInstance() ");
				var contractInstance = createContractInstance(_contractAddr);
				console.log("After calling createContractInstance() contractInstance :" +  contractInstance);
				contractInstance.getTotalVoteCountOfParty.call(_partyId, function(error,result){
                    if(error){
						console.log("getPartyVoteCount,  error :" +  error);
						reject(error);
					}else{
						console.log("getPartyVoteCount, result :" +  result);
						resolve(JSON.stringify(result));
					}
                });
				
			}
		});
	},

	doVoting : function(_partyId,_contractAddr){
		return new Promise(function(resolve,reject){
			console.log("Inside doVoting method");
			if(global.web3 !== 'undefined'){
				console.log("global web3 is defined");
				console.log("Before calling createContractInstance() ");
				var contractInstance = createContractInstance(_contractAddr);
				console.log("After calling createContractInstance() contractInstance :" +  contractInstance);
				contractInstance.doVoting.call(_partyId, function(error,result){
                    if(error){
						console.log("doVoting,  error :" +  error);
						reject(error);
					}else{
						console.log("doVoting, result :" +  result);
						resolve(JSON.stringify(result));
					}
                });
			}
		});
	},
	
}

function  createContractInstance(addr){
    //var     abiDefinitionString = document.getElementById('compiled_abidefinition').value;
    //var     abiDefinition = JSON.parse(abiDefinitionString);

    // Instance uses the definition to create the function

    var    contract = web3.eth.contract(ethconfig.abi);

   // THIS IS AN EXAMPLE - How to create a deploy using the contract
   // var instance = contract.new(constructor_params, {from:coinbase, gas:10000})
   // Use the next for manual deployment using the data generated
   // var contractData = contract.new.getData(constructor_params, {from:coinbase, gas:10000});
    var    address = addr;
    // Instance needs the address
    var    instance = contract.at(address);

    return instance;
}


module.exports = services;