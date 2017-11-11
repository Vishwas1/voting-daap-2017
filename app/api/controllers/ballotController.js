var config = require('../../../configs/config'),
User   = require('../model'),
dbConn = require('../../../conns/dbConn'),
jwt = require('jsonwebtoken'),
services = require('../../common/common');

//create,addParty,addvoter,validateVoter,getListOfParties,doVoting
var ballotController = {

    create : function(req,res){
        console.log('ballotController : create method begins');
        try
        {
            let body = req.body;
            let contractNameReq =  "Test1";//body.contractName;
            console.log('ballotController : contractNameReq ='+ contractNameReq);
            let startTimeReq = "1234";//body.startTime;
            console.log('ballotController : startTimeReq ='+ startTimeReq);
            let partyArrReq =['BJP','CONG', 'SAPA'];//body.startTime;
            console.log('ballotController : partyArrReq.length ='+ partyArrReq.length);
            if(contractNameReq != "" && startTimeReq != "" && typeof contractNameReq != 'undefined' && typeof startTimeReq != 'undefined')
            {   
                if(global.dbConnection)
                {
                    console.log('ballotController : Before calling service.newContract services = '+ services);
                    // services.unlockAccount()
                    // .then(function(res){
                        //console.log('ballotController : unlockAccount Success '); 
                        services.newContract(contractNameReq,startTimeReq,partyArrReq)
                        .then(function(result){
                            //If not then insert - Resolve promise
                            console.log('ballotController : newContract Success '); 
                            return res.json({status: 'Success' , address : result});  
                        }).catch(function(err){
                            //Alerady exists in the db - Reject Promise - respond saying that user name already exists
                            console.log('ballotController : newContract fail ');
                            return res.json({status: 'Error' , message : err});
                        });
                    // })
                    // .catch(function(err){
                    //     //Alerady exists in the db - Reject Promise - respond saying that user name already exists
                    //     console.log('ballotController : unlockAccount fail ');
                    //     return res.json({status: 'Error' , message : err});
                    // });
                }
                else
                {
                    console.log('ballotController : Database connection failed');
                    return res.json({status: 'Error' , message : 'Database connection failed'});
                }
            }
            else
            {
                console.log('ballotController : UserName or Password can not be null or empty');
                return res.json({status: 'Error',  message : 'UserName or Password can not be null or empty'});
            }
        }
        catch(err)
        {
            throw err;
        }
        console.log('ballotController : create method ends');
    },

    addParty : function(req,res){
        console.log('ballotController : create method begins');
        try
        {
            let body = req.body;
            let partyName =  "TestParty";//body.partyname;
            console.log('ballotController : partyName ='+ partyName);
            let contractAddr =  "0xbce3ea5e023add540b9376c4588821a15d60059a";//body.contractaddr;
            console.log('ballotController : contractAddr ='+ contractAddr);
            if(partyName != "" && contractAddr != "" && typeof partyName != 'undefined' && typeof contractAddr != 'undefined')
            {   
                if(global.dbConnection)
                {
                    console.log('ballotController : Before calling service.newContract services = '+ services);
                    services.addParty(partyName,contractAddr)
                    .then(function(result){
                        //If not then insert - Resolve promise
                        console.log('ballotController : addParty Pass '); 
                        return res.json({status: 'Success' , tran : result});  
                    }).catch(function(err){
                        //Alerady exists in the db - Reject Promise - respond saying that user name already exists
                        console.log('ballotController : addParty Fails ');
                        return res.json({status: 'Error' , message : err});
                    });
                }
                else
                {
                    console.log('ballotController : Database connection failed');
                    return res.json({status: 'Error' , message : 'Database connection failed'});
                }
            }
            else
            {
                console.log('ballotController : UserName or Password can not be null or empty');
                return res.json({status: 'Error',  message : 'UserName or Password can not be null or empty'});
            }
        }
        catch(err)
        {
            throw err;
        }
        console.log('ballotController : create method ends');
    },

    addVoter : function(req,res){
        console.log('ballotController : addVoter method begins');
        try
        {
            let body = req.body;
            let adharNumber =  "1234-1234";//body.adharNumber;
            console.log('ballotController : partyName ='+ partyName);
            if(adharNumber != "" && typeof adharNumber != 'undefined')
            {   
                if(global.dbConnection)
                {
                    console.log('ballotController : Before calling service.newContract services = '+ services);
                    services.addVoter(adharNumber)
                    .then(function(result){
                        console.log('ballotController : addVoter Pass '); 
                        return res.json({status: 'Success' , tran : result});  
                    }).catch(function(err){
                        console.log('ballotController : addVoter Fails ');
                        return res.json({status: 'Error' , message : err});
                    });
                }
                else
                {
                    console.log('ballotController : Database connection failed');
                    return res.json({status: 'Error' , message : 'Database connection failed'});
                }
            }
            else
            {
                console.log('ballotController : UserName or Password can not be null or empty');
                return res.json({status: 'Error',  message : 'UserName or Password can not be null or empty'});
            }
        }
        catch(err)
        {
            throw err;
        }
        console.log('ballotController : addVoter method ends');
    },

    validateVoter : function(req,res){
        console.log('ballotController : addVoter method begins');
        try
        {
            let body = req.body;
            let adharNumber =  "1234-1234";//body.adharNumber;
            console.log('ballotController : partyName ='+ partyName);
            if(adharNumber != "" && typeof adharNumber != 'undefined')
            {   
                if(global.dbConnection)
                {
                    console.log('ballotController : Before calling service.newContract services = '+ services);
                    services.validateVoter()
                    .then(function(result){
                        console.log('ballotController : addVoter Pass '); 
                        return res.json({status: 'Success' , tran : result});  
                    }).catch(function(err){
                        console.log('ballotController : addVoter Fails ');
                        return res.json({status: 'Error' , message : err});
                    });
                }
                else
                {
                    console.log('ballotController : Database connection failed');
                    return res.json({status: 'Error' , message : 'Database connection failed'});
                }
            }
            else
            {
                console.log('ballotController : UserName or Password can not be null or empty');
                return res.json({status: 'Error',  message : 'UserName or Password can not be null or empty'});
            }
        }
        catch(err)
        {
            throw err;
        }
        console.log('ballotController : addVoter method ends');
    },

    getListOfParties : function(req,res){
        console.log('ballotController : getListOfParties method begins');
        try
        {
            if(global.dbConnection)
            {
                console.log('ballotController : Before calling service.getListOfParties services = '+ services);
                services.getListOfParties()
                .then(function(result){
                    console.log('ballotController : getListOfParties Pass '); 
                    return res.json({status: 'Success' , tran : result});  
                }).catch(function(err){
                    console.log('ballotController : getListOfParties Fails ');
                    return res.json({status: 'Error' , message : err});
                });
            }
            else
            {
                console.log('ballotController : Database connection failed');
                return res.json({status: 'Error' , message : 'Database connection failed'});
            }
        }
        catch(err)
        {
            throw err;
        }
        console.log('ballotController : getListOfParties method ends');
    },

    doVoting : function(req,res){
        console.log('ballotController : partyId method begins');
        try
        {
            let body = req.body;
            let partyId =  "1234-1234";//body.adharNumber;
            console.log('ballotController : partyName ='+ partyName);
            if(partyId != "" && typeof partyId != 'undefined')
            {   
                if(global.dbConnection)
                {
                    console.log('ballotController : Before calling service.newContract services = '+ services);
                    services.doVoting(partyId)
                    .then(function(result){
                        console.log('ballotController : partyId Pass '); 
                        return res.json({status: 'Success' , tran : result});  
                    }).catch(function(err){
                        console.log('ballotController : partyId Fails ');
                        return res.json({status: 'Error' , message : err});
                    });
                }
                else
                {
                    console.log('ballotController : Database connection failed');
                    return res.json({status: 'Error' , message : 'Database connection failed'});
                }
            }
            else
            {
                console.log('ballotController : partyId can not be null or empty');
                return res.json({status: 'Error',  message : 'partyId can not be null or empty'});
            }
        }
        catch(err)
        {
            throw err;
        }
        console.log('ballotController : addVoter method ends');
    },
}

module.exports = ballotController;