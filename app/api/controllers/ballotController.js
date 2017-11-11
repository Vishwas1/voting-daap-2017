var config = require('../../../configs/config'),
User   = require('../model'),
dbConn = require('../../../conns/dbConn'),
jwt = require('jsonwebtoken'),
services = require('../../common/common');


var ballotController = {
create : function(req,res){
    console.log('userController : create method begins');
    try
    {
        let body = req.body;
        let contractNameReq =  "Test";//body.contractName;
        console.log('userController : contractNameReq ='+ contractNameReq);
        let startTimeReq = "1234";//body.startTime;
        console.log('userController : startTimeReq ='+ startTimeReq);
        if(contractNameReq != "" && startTimeReq != "" && typeof contractNameReq != 'undefined' && typeof startTimeReq != 'undefined')
        {   
            if(global.dbConnection)
            {
                console.log('userController : Before calling service.newContract services = '+ services);
                services.newContract(contractNameReq,startTimeReq)
                .then(function(result){
                    //If not then insert - Resolve promise
                    console.log('userController : Promise1 resolved: User does not exists in Database '); 
                    return res.json({status: 'Success' , address : result});  
                }).catch(function(err){
                    //Alerady exists in the db - Reject Promise - respond saying that user name already exists
                    console.log('userController : Promise1 rejected: User already exists in Database ');
                    return res.json({status: 'Error' , message : err});
                });
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

module.exports = ballotController;