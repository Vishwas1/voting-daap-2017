
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
			if(usernameReq != "" && passwordReq != "" && typeof usernameReq != 'undefined' && typeof passwordReq != 'undefined')
			{
				if(global.dbConnection)
				{
					console.log('userController : Database connection success');
					if(typeof global.dbQueryObj != 'undefined')
					{
						var query = { username :  usernameReq };
						var model = "User1";
						services.checkExists(query,model)
						.then(function(result){
							//If not then insert - Resolve promise
							console.log('userController : Promise1 resolved: User does not exists in Database ');
							var userVar = new User({
								username : usernameReq,
								password : passwordReq
							});
							services.insertIntoDb(userVar,model);
						}, function(err){
							//Alerady exists in the db - Reject Promise - respond saying that user name already exists
							console.log('userController : Promise1 rejected: User already exists in Database ');
							return res.json({status: 'Error' , message : 'User already exisits Database'});
						})
						.then(function(result){
							// Successfully inserted into db - 2nd Promise resolved
							console.log('userController : Promise2 resolved: User created successfully ');
							return res.status(200).json({message: 'user created successfully'});								
						},function(err){
							// Successfully inserted into db - 2nd Promise rejected
							console.log('userController : Promise2 rejected: Could not insert into Database err = '+err);
							return res.json({status: 'Error' , message : 'Could not insert into Database'});
						})
						.catch(function(e){
							console.log('userController :Error e.Message = '+ e.Message + ', e.Stack = '+ e.Stack);
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
		console.log('authController : authenticate method starts');

		var usernameReq = "", passwordReq= "";
		var body = req.body;
		usernameReq = body.username;
		console.log('authController : usernameReq ='+ usernameReq);
		passwordReq = body.password;
		console.log('authController : passwordReq ='+ passwordReq);
		if(usernameReq != "" && passwordReq != "" && usernameReq != 'undefined' && passwordReq != 'undefined')
		{
			if(global.dbConnection)
			{
				console.log('authController : Database connection success');
				if(typeof global.dbQueryObj != 'Undefined')
				{
					services.checkIfUserExists(usernameReq)
					.then(function(user){
						if(typeof user == 'undefined')
						{
							return res.json({status : 'Error', message : 'Authentication failed. User not found'});
						}
						else
						{
							if(user.password === passwordReq)
							{
								var token = services.getToken(user);
								res.json({
						          success: true,
						          message: 'Your Token!',
						          token: token
						        });
							}
							else
							{
								return res.json({status : 'Error', message : 'Authentication failed. Wrong password'});
							}
						}
					},function(err){
						return res.json({status : 'Error', message : err});
					})
					.catch(function(e){
						console.log('authController :Error = '+ e);
					});
				}
				else
				{
					console.log('authController : global.db is undefined');		
				}
			}
			else
			{
				console.log('authController : Database connection failed');
			}	
		}
		else
		{
			console.log('userController : UserName or Password can not be null or empty');
			return res.json({status: 'Error',  message : 'UserName or Password can not be null or empty'});
		}
		console.log('authController : authenticate method ends');
	}
}

module.exports = userController;