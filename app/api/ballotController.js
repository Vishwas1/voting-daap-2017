var config = require('../../config'),
User   = require('./model'),
dbConn = require('../../dbConn'),
jwt = require('jsonwebtoken'),
services = require('../common/common');


var userController = {
create : function(req,res){
    console.log('userController : create method begins');
    try
    {
        let body = req.body;
        let contractNameReq = body.contractName;
        console.log('userController : contractNameReq ='+ contractNameReq);
        let startTimeReq = body.password;
        console.log('userController : startTimeReq ='+ startTimeReq);
        if(contractNameReq != "" && startTimeReq != "" && typeof contractNameReq != 'undefined' && typeof startTimeReq != 'undefined')
        {   
            if(global.dbConnection)
            {
                console.log('userController : Database connection success');
                if(typeof global.dbQueryObj != 'undefined')
                {
                    var query = { username :  contractNameReq };
                    var model = "User1";
                    services.checkExists(query,model)
                    .then(function(result){
                        //If not then insert - Resolve promise
                        console.log('userController : Promise1 resolved: User does not exists in Database ');
                        var userVar = new User({
                            username : contractNameReq,
                            password : startTimeReq
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
}
}

module.exports = userController;