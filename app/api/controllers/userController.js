
var config = require('../../../configs/config'),
	User   = require('../model'),
	dbConn = require('../../../conns/dbConn'),
	jwt = require('jsonwebtoken'),
	services = require('../../common/common');

	
var userController = {
	create : function(req,res){
		console.log('userController : create method begins');
		var usernameReq = "", passwordReq= "";
		try
		{
			
			var body = req.body;
			usernameReq = body.username;
			console.log('userController : usernameReq ='+ usernameReq);
			passwordReq = body.password;
			console.log('userController : passwordReq ='+ passwordReq);
			adharnumber = body.adharnumber;
			console.log('userController : adharnumber ='+ adharnumber);
			if(usernameReq != "" && passwordReq != ""  && adharnumber != ""
			&& typeof usernameReq != 'undefined' && typeof passwordReq != 'undefined'
			&& typeof adharnumber != 'undefined' 
		)
			{
				if(global.dbConnection)
				{
					console.log('userController : Database connection success');
					if(typeof global.dbQueryObj != 'undefined')
					{
						//var query = { username :  usernameReq };
						var query = { adharnum :  adharnumber };
						var model = "User_1";
						var publickey = "";
						services.checkExists(query,model)
						.then(function(result){
							//If not then insert - Resolve promise
							console.log('userController : Promise1 resolved: User does not exists in Database ');
							return services.createAccount(passwordReq);
						})
						.then(function(result){
							publickey = result;	
							if(publickey!="" && publickey != 'undefined'){
								var userVar = new User({
									username : usernameReq,
									password : passwordReq,
									adharnum : adharnumber,
									publickey : result
									});
	
								console.log('userController : publickey = '+  result);
								return services.insertIntoDb(userVar,model);
								console.log('userController : Promise2 resolved: User created successfully into ethereum ');
							}else{
							}
						})
						.then(function(result){
							// Successfully inserted into db - 3rd Promise resolved
							console.log('userController : Promise3 resolved: User inserted into db');
							return res.status(200).json({status : 'success',  message: 'User created successfully!'});								
						})
						.catch(function(e){
							console.log('userController :Error e.Message = '+ e.Message + ', e.Stack = '+ e.Stack);
							return res.json({status: 'Error' , message : e});
						});
					}
					else
					{
						console.log('userController : global.db is undefined');		
					}
				}
				else
				{
					console.log('userController : Database connection failed');
					return res.json({status: 'Error' , message : 'Database connection failed'});
				}
			}
			else
			{
				console.log('userController : UserName or Password can not be null or empty');
				return res.json({status: 'Error',  message : 'UserName or Password can not be null or empty'});
			}
		}
		catch(err)
		{
			throw err;
		}
		console.log('userController : create method ends');
	},

	login : function(req,res){
		console.log('userController :: Login : authenticate method starts');
		var adharnumberReq = "", passwordReq= "";
		var body = req.body;
		adharnumberReq =  body.adharnumber;
		console.log('userController :: Login : adharnumberReq ='+ adharnumberReq);
		passwordReq = body.password;
		console.log('userController :: Login :  passwordReq ='+ passwordReq);
		if(adharnumberReq != "" && passwordReq != "" && adharnumberReq != 'undefined' && passwordReq != 'undefined')
		{
			if(global.dbConnection)
			{
				console.log('userController :: Login : Database connection success');
				if(typeof global.dbQueryObj != 'Undefined')
				{
					services.checkIfUserExists(adharnumberReq)
					.then(function(user){
						console.log('USer == '+ user);
						if(typeof user == 'undefined'){
							return res.json({status : 'Error', message : 'Authentication failed. User not found'});
						}else{
							if(user.password == passwordReq){
								var objTosend = {
									status: 'Success',
									message: 'Login successfull!',
									adhaar : user.adharnum,
									username : user.username
								  };
								  console.log('object to send = ', objTosend);
								res.json(objTosend);
							}else{
								return res.json({status : 'Error', message : 'Authentication failed. Wrong password'});
							}
						}
					})
					.catch(function(e){
						console.log('userController :: Login : Error = '+ e);
						return res.json({status : 'Error', message : e});				
					});
				}
				else
				{
					console.log('userController :: Login : global.db is undefined');		
				}
			}
			else
			{
				console.log('userController :: Login : Database connection failed');
			}	
		}
		else
		{
			console.log('userController :: Login : UserName or Password can not be null or empty');
			return res.json({status: 'Error',  message : 'UserName or Password can not be null or empty'});
		}
		console.log('userController :: Login :  authenticate method ends');
	},

	getBallotList : function(req,res){
		console.log('userController :: getBallotList : authenticate method starts');
		var adharnumberReq = "";
		var body = req.body;
		adharnumberReq =  body.adharnumber;	
		//adharnumberReq = "5845";	
		console.log('userController :: getBallotList : adharnumberReq ='+ adharnumberReq);
		//if(adharnumberReq != "" && adharnumberReq != 'undefined')
		//{
			if(global.dbConnection)
			{
				console.log('userController :: getBallotList : Database connection success');
				if(typeof global.dbQueryObj != 'Undefined')
				{
					console.log('userController :: getBallotList : Before calling getBallotList() ');
					services.getBallotList(adharnumberReq)
					.then(function(contracts){
						if(contracts!=null && typeof contracts != 'undefined' && contracts.length >0){
							return res.json({status : 'Success', message : JSON.stringify(contracts)});
						}else{
							return res.json({status : 'Error', message : 'No Contacts found'});
						}
					})
					.catch(function(e){
						console.log('userController :: getBallotList :Error = '+ e);
						return res.json({status : 'Error', message : e});
					});
				}
				else
				{
					console.log('userController : global.db is undefined');		
				}
			}
			else
			{
				console.log('userController : Database connection failed');
			}	
		// }
		// else
		// {
		// 	console.log('userController : UserName or Password can not be null or empty');
		// 	return res.json({status: 'Error',  message : 'UserName or Password can not be null or empty'});
		// }
		console.log('userController : getBallotList method ends');
	},
}

module.exports = userController;