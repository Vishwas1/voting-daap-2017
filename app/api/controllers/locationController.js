
var config = require('../../../configs/config'),
	User   = require('../locModel'),
	dbConn = require('../../../conns/dbConn'),
	jwt = require('jsonwebtoken'),
	services = require('../../common/common');

	
var locationController = {
	addLocation : function(req,res){
		console.log('locationController : create method begins');
		var locaddress = "", loclongitude= "", loclatitude ="", username="";
		try
		{
			var body = req.body;
			
			username = body.username;
			if(!username) return res.json({status : 'Error', message : 'Username can not be empty'});
			console.log('locationController : username ='+ username);
			
			locaddress = body.address;
			if(!locaddress) return res.json({status : 'Error', message : 'Location Name can not be empty'});
			console.log('locationController : locaddress ='+ locaddress);

			loclongitude = body.longitude;
			if(!loclongitude) return res.json({status : 'Error', message : 'Location longitude can not be empty'});
			console.log('locationController : loclongitude ='+ loclongitude);

			loclatitude = body.latitude;
			if(!loclatitude) return res.json({status : 'Error', message : 'Location loclatitude can not be empty'});
			console.log('locationController : loclatitude ='+ loclatitude);
			
			if(global.dbConnection)
			{
				console.log('locationController : Database connection success');
				if(typeof global.dbQueryObj != 'undefined')
				{
					var token = req.token;
					jwt.verify(token, config.secret, function(err, decoded) {      
					    if(err) res.sendStatus(403);
					    else 
					    {
					   		var query = { username :  username , longitude :loclongitude,  latitude : loclatitude };
							var model = "Location1";
							services.checkExists(query,model)
							.then(function(result){
								//If not then insert - Resolve promise
								console.log('locationController : Promise1 resolved: Location does not exists in Database ');
								var loc = new Location({
									username : username,
									address : locaddress,
									longitude : loclongitude,
									latitude : loclatitude
								});
								services.insertIntoDb(loc,model);
							}, function(err){
								//Alerady exists in the db - Reject Promise - respond saying that user name already exists
								console.log('locationController : Promise1 rejected: Location already exists in Database ');
								return res.json({status: 'Error' , message : 'Location already exisits Database'});
							})
							.then(function(result){
								// Successfully inserted into db - 2nd Promise resolved
								console.log('locationController : Promise2 resolved: Location created successfully ');
								return res.status(200).json({message: 'Location created successfully'});								
							},function(err){
								// Successfully inserted into db - 2nd Promise rejected
								console.log('locationController : Promise2 rejected: Could not insert into Database err = '+err);
								return res.json({status: 'Error' , message : 'Could not insert into Database'});
							})
							.catch(function(e){
								console.log('locationController :Error = '+ e);
							});  	
					    }
					});
				}
				else
				{
					console.log('locationController : global.db is undefined');		
				}
			}
			else
			{
				console.log('locationController : Database connection failed');
				return res.json({status: 'Error' , message : 'Database connection failed'});
			}
		}
		catch(err)
		{
			throw err;
		}
		console.log('locationController : create method ends');
	},

	fetchLocation : function(req,res){
		console.log('locationController : fetchLocation method starts');
		var username = req.query.username;
		if(!username) return res.json({status : 'Error', message : 'Username can not be empty'});
			console.log('locationController : username ='+ username);
		if(global.dbConnection)
		{
			console.log('locationController : Database connection success');
			if(typeof global.dbQueryObj != 'Undefined')
			{
				var token = req.token;
				jwt.verify(token, config.secret, function(err, decoded) {      
				    if(err) res.sendStatus(403);
				    else 
				    {
				     	var OueryObj = global.dbQueryObj.collection("Location1");
						var query = { username :  username };
						new Promise(function(resolve,reject){
							OueryObj.find(query, {_id :false}).toArray(function(err, locations) {
								if(err) throw err;
								else resolve(locations);
							});
						})
						.then(function(locations){
							res.json(locations);
						})
						.catch(function(err){
							console.log('locationController : Error = '+ err);
							res.json({status :'Error', message : 'Error in validating token'});
						});
				    }
				});
			}
			else
			{
				console.log('locationController : global.db is undefined');		
			}
		}
		else
		{
			console.log('locationController : Database connection failed');
		}
		console.log('locationController : fetchLocation method ends');
	}
}

module.exports = locationController;