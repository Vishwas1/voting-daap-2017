var config = require('../../configs/config'),
	ethconfig = require('../../configs/ethConfig'),
	User   = require('../api/model'),
	Contract   = require('../api/ContractModel'),
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
				else reject('User already exists in Database');
			});
		});
	},

	checkIfUserExists : function(_adharnumber){
		var OueryObj = global.dbQueryObj.collection("User_1");
		return new Promise(function(resolve,reject){

			console.log('checkIfUserExists starts .......');
			var query = { adharnum :  _adharnumber };
			console.log('userController : query = '+ query);
			
			OueryObj.find(query).toArray(function(err, results){
				console.log('Return from Mongo db query ' + results); // output all records
				if(results!='undefined' && results.length > 0){
					console.log('Return from Mongo db query , results.length = ' + results.length); 
					console.log('Return from Mongo db query , results = ' + results); 
					resolve(results[0]);
				}else{
					console.log('Authentication failed. User not found');
					reject('Authentication failed. User not found');
				}
			});


			// OueryObj.find({adharnum : _adharnumber })
			// //OueryObj.find(query)
			// .toArray(function(err,result){
			// 	if(err) throw err;
			// 	console.log('userController : result = '+ result[0].username);
			// 	console.log('userController : result = '+ result[0].password);
			// 	console.log('userController : result = '+ result);
			// 	if(result.length > 0)
			// 		resolve(result[0]);
			// 	else
			// 		reject('Authentication failed. User not found');
			// });
		});
	},
	getBallotList : function(_adharnumber){
		var OueryObj = global.dbQueryObj.collection("Contract_1");
		return new Promise(function(resolve,reject){
			var query = {};
			if(typeof _adharnumber != 'undefined'){
				console.log('getBallotList :_adharnumber != undefined');
				query = { adharnum :  _adharnumber };
			}else{
				console.log('getBallotList :_adharnumber == undefined');
				query = {};
			}
			//Check if UserName exists 
			//OueryObj.find(query).toArray(function(err,result){
			OueryObj.find(query).toArray(function(err,result){
				if(err){
					console.log('getBallotList : result = '+ result.length);
					reject('getBallotList failed, rejected , error  =  ');
				}else{
					if(result!= 'undefined' && result!="" && result!= null){
						result.forEach(function(element) {
							//console.log('getBallotList : resolved, element.contractaddr = '+ element.contractaddr);
							//console.log('getBallotList : resolved, element.contractname = '+ element.contractname);
						}, this);
						resolve(result);
					}
				}
			});
		});
	},

	
	insertIntoDb : function(objToInsert,model){
		var OueryObj = global.dbQueryObj.collection(model);
		return new Promise(function(resolve,reject){
			OueryObj.insertOne(objToInsert, function(err, result) {
			    if(err){
					console.log('Common :: insertIntoDb : Promise1 rejected: error = '  + err) ;
					reject(err);
				}else{
					console.log('Common ::  insertIntoDb : Promise1 resolved: result.insertedCount = '+ result.insertedCount);
					if(result.insertedCount == 1)
						resolve('Inserted');
			    }
			   
			    	
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
						if (typeof contract.address != 'undefined') {
							console.log('Contract mined! address: ' + contract.address + ' transactionHash: ' + contract.transactionHash);
							//setTimeout(function() {
								resolve(contract.address);
							//}, 5000);
					   }
					}
				});
			}
		});
	},

	unlockAccount : function(){
		return new Promise(function(resolve,reject){
			console.log("Inside unlockAccount method");
			if(global.web3 != 'undefined'){
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

	createAccount : function(_password){
		return new Promise(function(resolve,reject){
			console.log("Inside createAccount method");
			try{
				if(global.web3 != 'undefined'){
					var web3 = global.web3;
					var accountAddr  = web3.eth.accounts[0];
					web3.personal.newAccount(_password, function(error, result){
						if(error){
							console.log("Common :: Method createAccount  ,  error = ", error);
							reject('');
						}else{
							console.log("Common :: Method createAccount  ,  result = ", result);
							resolve(result);
						}
					});
				}else{
					console.log("Common :: Method createAccount , global.web3 is undefined");	
				}

			}catch(e){
				console.log("Common :: Method createAccount , Inside Catch errror = "+ e.Message);
				reject(e);
			}
		});
	},

	addParty : function(_partyName, _contractAddr){
		return new Promise(function(resolve,reject){
			console.log("Common :: Method addParty starts..");
			if(global.web3 !== 'undefined'){
				console.log("Common :: Method addParty : Before calling createContractInstance() ");
				var contractInstance = createContractInstance(_contractAddr);
				try{
					if(typeof contractInstance != 'undefined'){
						console.log("Common :: Method addParty : After calling createContractInstance()");
						console.log("Common :: Method addParty : Before calling contractInstance.addParty() ");
						contractInstance.addParty(
							_partyName, 
							{from: global.web3.eth.accounts[0], gas : ethconfig.gas},
							function(e,r){
								if(e){
									console.log("Common :: Method addParty : Inside Callback, rejected, err ="+ e);
									reject(e);
								}else{
									console.log("Common :: Method addParty : Inside Callback, resolved, result ="+ r);
									resolve(r);
								}
							}
						);
					}else{
						console.log("Common :: Method addParty :  contractInstance != undefined");
						reject(" contractInstance != undefined");	
					}
				}catch(e){
					console.log("Common :: Method addParty : Inside catch, err ="+ e);
					reject(e);
				}		
			}else{
				console.log("Method addParty : ");
				reject("global.web3 is undefined");
			}
		});
	},

	addVoter : function(_adharNumber, _contractAddr){
		return new Promise(function(resolve,reject){
			console.log("Common :: Method addVoter starts..");
			if(global.web3 !== 'undefined'){
				console.log("Common :: Method addVoter : Before calling createContractInstance() ");
				var contractInstance = createContractInstance(_contractAddr);
				try{
					if(typeof contractInstance != 'undefined'){
						console.log("Common :: Method addVoter : After calling createContractInstance()");
						console.log("Common :: Method addVoter : Before calling contractInstance.addParty() ");
						contractInstance.addVoter(
							_adharNumber, 
							{from: global.web3.eth.accounts[0], gas : ethconfig.gas},
							function(e,r){
								if(e){
									console.log("Common :: Method addVoter : Inside Callback, rejected, err ="+ e);
									reject(e);
								}else{
									console.log("Common :: Method addVoter : Inside Callback, resolved, result ="+ r);
									resolve(r);
								}
							}
						);
					}else{
						console.log("Common :: Method addVoter :  contractInstance != undefined");
						reject(" contractInstance != undefined");	
					}
				}catch(e){
					console.log("Common :: Method addVoter : Inside catch, err ="+ e);
					reject(e);
				}		
			}else{
				console.log("Method addVoter : ");
				reject("global.web3 is undefined");
			}
		});
	},

	getListOfParties : function(_contractAddr){
		return new Promise(function(resolve,reject){
			console.log("Common :: Method getListOfParties starts..");
			if(global.web3 != 'undefined'){
				console.log("Common :: Method getListOfParties : Before calling createContractInstance(),_contractAddr = "+ _contractAddr);
				var contractInstance = createContractInstance(_contractAddr);
				if(typeof contractInstance != 'undefined' && contractInstance != null){
					console.log("Common :: Method getListOfParties : After calling createContractInstance()");
				    try{
						contractInstance.getListOfParties({},
							{from: global.web3.eth.accounts[0], gas : ethconfig.gas},
							function(e,r){
								if(e){
									console.log("Common :: Method getListOfParties : Inside Callback, rejected, err ="+ e);
									reject(e);
								}else{
									console.log("Common :: Method getListOfParties : Inside Callback, resolved, result ="+ r);
									var partyListArr = [];
									if(typeof r != 'undefined'){
										r.forEach(function(e) {
											partyListArr.push(global.web3.toAscii(e));
										}, this);
										resolve(JSON.stringify(partyListArr));
									}
									
									
								}
							}
						);
					}catch(e){
						console.log("Common :: Method getListOfParties : Inside catch, Error ="+ e);
						reject(e);
					}
				}else{
					console.log("Common :: Method getListOfParties :  contractInstance != undefined");
					reject(" contractInstance != undefined");
				}
			}else{
				console.log("Common :: Method getListOfParties : global.web3 is undefined");
				reject("global.web3 is undefined");
			}
		});
	},

	validateVoter : function(_adharNumber, _contractAddr){
		return new Promise(function(resolve,reject){
			console.log("Common :: Method validateVoter starts..");
			if(global.web3 != 'undefined'){
				console.log("Common :: Method validateVoter : Before calling createContractInstance() ");
				var contractInstance = createContractInstance(_contractAddr);
				try{
					if(typeof contractInstance != 'undefined'){
						console.log("Common :: Method validateVoter : After calling createContractInstance()");
						console.log("Common :: Method validateVoter : Before calling contractInstance.addParty() ");
						contractInstance.validateBallotVoter(
							_adharNumber, 
							{from: global.web3.eth.accounts[0], gas : ethconfig.gas},
							function(e,r){
								if(e){
									console.log("Common :: Method validateVoter : Inside Callback, rejected, err ="+ e);
									reject(e);
								}else{
									console.log("Common :: Method validateVoter : Inside Callback, resolved, result ="+ r);
									resolve(JSON.stringify(r));
								}
							}
						);
					}else{
						console.log("Common :: Method validateVoter :  contractInstance != undefined");
						reject(" contractInstance != undefined");	
					}
				}catch(e){
					console.log("Common :: Method validateVoter : Inside catch, err ="+ e);
					reject(e);
				}		
			}else{
				console.log("Method validateVoter : ");
				reject("global.web3 is undefined");
			}
		});
	},

	doVoting : function(_partyId, _contractAddr){
		return new Promise(function(resolve,reject){
			console.log("Common :: Method doVoting starts..");
			if(global.web3 != 'undefined'){
				console.log("Common :: Method doVoting : Before calling createContractInstance() ");
				var contractInstance = createContractInstance(_contractAddr);
				try{
					if(typeof contractInstance != 'undefined'){
						console.log("Common :: Method doVoting : After calling createContractInstance()");
						console.log("Common :: Method doVoting : Before calling contractInstance.addParty() ");
						contractInstance.doVoting(
							_partyId, 
							{from: global.web3.eth.accounts[0], gas : ethconfig.gas},
							function(e,r){
								if(e){
									console.log("Common :: Method doVoting : Inside Callback, rejected, err ="+ e);
									reject(e);
								}else{
									console.log("Common :: Method doVoting : Inside Callback, resolved, result ="+ r);
									resolve(r);
								}
							}
						);
					}else{
						console.log("Common :: Method doVoting :  contractInstance != undefined");
						reject(" contractInstance != undefined");	
					}
				}catch(e){
					console.log("Common :: Method doVoting : Inside catch, err ="+ e);
					reject(e);
				}		
			}else{
				console.log("Method doVoting : ");
				reject("global.web3 is undefined");
			}
		});
	},

	getPartyVoteCount : function(_partyId, _contractAddr){
		return new Promise(function(resolve,reject){
			console.log("Common :: Method getPartyVoteCount starts..");
			if(global.web3 != 'undefined'){
				console.log("Common :: Method getPartyVoteCount : Before calling createContractInstance() ");
				var contractInstance = createContractInstance(_contractAddr);
				try{
					if(typeof contractInstance != 'undefined'){
						console.log("Common :: Method getPartyVoteCount : After calling createContractInstance()");
						console.log("Common :: Method getPartyVoteCount : Before calling contractInstance.addParty() ");
						contractInstance.getTotalVoteCountOfParty(
							_partyId, 
							{from: global.web3.eth.accounts[0], gas : ethconfig.gas},
							function(e,r){
								if(e){
									console.log("Common :: Method getPartyVoteCount : Inside Callback, rejected, err ="+ e);
									reject(e);
								}else{
									console.log("Common :: Method getPartyVoteCount : Inside Callback, resolved, result ="+ r);
									resolve(r);
								}
							}
						);
					}else{
						console.log("Common :: Method getPartyVoteCounto :  contractInstance != undefined");
						reject(" contractInstance != undefined");	
					}
				}catch(e){
					console.log("Common :: Method getPartyVoteCount : Inside catch, err ="+ e);
					reject(e);
				}		
			}else{
				console.log("Method getPartyVoteCount : ");
				reject("global.web3 is undefined");
			}
		});
	},
}

function  createContractInstance(addr){
    //var     abiDefinitionString = document.getElementById('compiled_abidefinition').value;
    //var     abiDefinition = JSON.parse(abiDefinitionString);
	console.log("Method createContractInstance() starts ");
	// Instance uses the definition to create the function
	try{
		var instance;
		if(typeof global.web3 != 'undefined' || typeof addr !='undefined'){
			if(typeof global.web3.eth !='undefined'){
				console.log("Method createContractInstance(): Before loagin ethconfig.abi ");
				var    contract = global.web3.eth.contract(ethconfig.abi);
				console.log("Method createContractInstance(): After loagin ethconfig.abi ");
				// THIS IS AN EXAMPLE - How to create a deploy using the contract
				// var instance = contract.new(constructor_params, {from:coinbase, gas:10000})
				// Use the next for manual deployment using the data generated
				// var contractData = contract.new.getData(constructor_params, {from:coinbase, gas:10000});
				var    address = addr;
				console.log("Method createContractInstance(): address = "+ address);
				// Instance needs the address
				var    instance = contract.at(address);
				console.log("Method createContractInstance(): After creatinng instance of contract");
			}else{
				console.log("Method createContractInstance(): global.web3.eth is null or emtpy ");	
			}
		}else{
			console.log("Method createContractInstance(): global.web3 || contract address  is null or emtpy ");	
		}
	}catch(e){
         console.log("Method createContractInstance(): Inside catch, Error  = " + e);
	}
	
	console.log("Method createContractInstance()ends");
    return instance;
}


 

module.exports = services;