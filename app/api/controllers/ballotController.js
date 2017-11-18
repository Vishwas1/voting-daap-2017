var config = require('../../../configs/config'),
User   = require('../model'),
Contract   = require('../ContractModel'),
dbConn = require('../../../conns/dbConn'),
jwt = require('jsonwebtoken'),
services = require('../../common/common');
adharvalidator = require('aadhaar-validator')
//create,addParty,addvoter,validateVoter,getListOfParties,doVoting
var ballotController = {

    create : function(req,res){
        console.log('ballotController : create method begins');
        try
        {
            var body = req.body;
            var adharnumReq =  body.adharnumber;
           // adharnumReq = 'aaaa';
            console.log('ballotController : adharnumReq ='+ adharnumReq);
            var contractNameReq = body.contractName;
           // contractNameReq = 'Contract001';
            console.log('ballotController : contractNameReq ='+ contractNameReq);
            var startTimeReq = body.startTime;
            startTimeReq = 1
            console.log('ballotController : startTimeReq ='+ startTimeReq);
            var partyArrStr = body.partyArr;
            //partyArrStr = "BJP,CONG,SORE";
            var partyArrReq = partyArrStr.split(',');
            console.log('ballotController : partyArrReq.length ='+ partyArrReq.length);
            if(contractNameReq != "" && startTimeReq != "" && typeof contractNameReq != 'undefined' && typeof startTimeReq != 'undefined')
            {   
                if(global.dbConnection)
                {
                    var model = "Contract_1";
                    startTimeReq = 1;
                    console.log('ballotController : Before calling service.newContract services = '+ services);
                    // services.unlockAccount()
                    // .then(function(res){
                    //     console.log('ballotController : Promise resolved : unlockAccount Success '); 
                    //     startTimeReq = 1;
                    //     services.newContract(contractNameReq,startTimeReq,partyArrReq);
                    // })
                    services.newContract(contractNameReq,startTimeReq,partyArrReq)
                    .then(function(result){
                        console.log('ballotController : Promise resolved : newContract , contract address = ' + result); 
                        if(typeof result != 'undefined'){
                            var contractVar = new Contract({
                                adharnum : adharnumReq,
                                contractaddr : result,
                                contractname : contractNameReq,
                                contractStartTime : "",
                                contractEndTime : ""
                                });
                            console.log(contractVar);
                            return services.insertIntoDb(contractVar,model);
                        }else{
                            console.log('result is undefined');
                        }                        
                    })
                    .then(function(result){
                        console.log('ballotController : Promise resolved : insertIntoDb  success'); 
                        return res.json({status: 'Success' , address : result});  
                    })
                    .catch(function(err){
                        console.log('ballotController : unlockAccount fail ');
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

    addParty : function(req,res){
        console.log('ballotController : create method begins');
        try
        {
            let body = req.body;
            let partyName =  body.partyname;
            console.log('ballotController : partyname ='+ partyname);
            let contractAddr =  body.contractaddr;
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
            let adharNumber = body.adharNumber;             
            console.log('ballotController : adharNumber ='+ adharNumber);
            let contractAddr =  body.contractaddr;
            console.log('ballotController : contractAddr ='+ contractAddr);
            if(adharNumber != "" && typeof adharNumber != 'undefined')
            {   
                if(global.dbConnection)
                {                   
                    console.log('ballotController : addVoter ,adharNumber  = '+ adharNumber);
                    console.log('ballotController : Before calling addVoter');
                    services.addVoter(adharNumber,contractAddr)
                    .then(function(result){
                        console.log('ballotController : addVoter Pass, trans = '+ result ); 
                        return res.json({status: 'Success' , message : 'Voters added'});  
                        
                    })
                    .catch(function(err){
                        console.log('ballotController : Inside catch addVoter Fails ');                                
                        return res.json({status: 'Erro' , message : err});  
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
                console.log('ballotController : adharNumber or adharNumber can not be null or empty');
                return res.json({status: 'Error',  message : 'adharNumber or adharNumber can not be null or empty'});
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
            let contractAddr = req.body.contractaddr;
            // console.log('ballotController : body ='+ req.body);
            console.log('ballotController : contractAddr ='+ contractAddr);
            if(contractAddr != "" && typeof contractAddr != 'undefined'){  
                if(global.dbConnection){
                    console.log('ballotController : Before calling service.getListOfParties services = '+ services);
                    services.getListOfParties(contractAddr)
                    .then(function(result){
                        console.log('ballotController : getListOfParties Pass '); 
                        return res.json({status: 'Success' , tran : result});  
                    }).catch(function(err){
                        console.log('ballotController : getListOfParties Fails ');
                        return res.json({status: 'Error' , message : err});
                    });
                }
                else{
                    console.log('ballotController : Database connection failed');
                    return res.json({status: 'Error' , message : 'Database connection failed'});
                }
            }else{
                console.log('ballotController : UserName or Password can not be null or empty');
                return res.json({status: 'Error',  message : 'contractAddr is null or empty'});
            }
        }
        catch(err)
        {
            throw err;
        }
        console.log('ballotController : getListOfParties method ends');
    },

    validateVoter : function(req,res){
        console.log('ballotController : validateVoter method begins');
        try
        {
            let body = req.body;
            console.log('ballotController :  body ='+ body);
            let adharNumber =  body.adharNumber;
            console.log('ballotController : adharNumber ='+ adharNumber);
            let contractAddr =  body.contractaddr;
            console.log('ballotController : contractAddr ='+ contractAddr);
            if(adharNumber != "" && typeof adharNumber != 'undefined' && contractAddr != "" && typeof contractAddr != 'undefined')
            {   
                if(global.dbConnection)
                {
                    console.log('ballotController : Before calling service.newContract services = '+ services);
                    services.validateVoter(adharNumber,contractAddr)
                    .then(function(result){
                        console.log('ballotController : validateVoter Pass '); 
                        return res.json({status: 'Success' , tran : result});  
                    }).catch(function(err){
                        console.log('ballotController : validateVoter Fails ');
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
                console.log('ballotController : Adhaar or Contract Address can not be null or empty');
                return res.json({status: 'Error',  message : 'Adhaar or Contract Address can not be null or empty'});
            }
        }
        catch(err)
        {
            throw err;
        }
        console.log('ballotController : validateVoter method ends');
    },

    doVoting : function(req,res){
        console.log('ballotController : partyId method begins');
        try
        {

            let body = req.body;
            let partyId =  body.partyid;
            console.log('ballotController : partyId ='+ partyId);
            let contractAddr =  body.contractaddr;
            console.log('ballotController : contractAddr ='+ contractAddr);
            //if(partyId != "" && typeof partyId != 'undefined')
            //{   
                if(global.dbConnection)
                {
                    console.log('ballotController : Before calling doVoting services = '+ services);
                    services.doVoting(partyId,contractAddr)
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
            // }
            // else
            // {
            //     console.log('ballotController : partyId can not be null or empty');
            //     return res.json({status: 'Error',  message : 'partyId can not be null or empty'});
            // }
        }
        catch(err)
        {
            throw err;
        }
        console.log('ballotController : addVoter method ends');
    },

    getPartyVoteCount : function(req,res){
        console.log('ballotController : getPartyVoteCount method begins');
        try
        {
            let body = req.body;
            console.log(body);
            let contractAddr = body.contractaddr;
            console.log('ballotController : contractAddr ='+ contractAddr);
            let partyId =  body.partyid;
            console.log('ballotController : partyId ='+ partyId);
            if(contractAddr != "" && typeof contractAddr != 'undefined'){  
                if(global.dbConnection){
                    console.log('ballotController : Before calling getPartyVoteCount services = '+ services);
                    services.getPartyVoteCount(partyId,contractAddr)
                    .then(function(result){
                        console.log('ballotController : getPartyVoteCount Pass '); 
                        return res.json({status: 'Success' , votecount : result});  
                    }).catch(function(err){
                        console.log('ballotController : getPartyVoteCount Fails ');
                        return res.json({status: 'Error' , message : err});
                    });
                }
                else{
                    console.log('ballotController : Database connection failed');
                    return res.json({status: 'Error' , message : 'Database connection failed'});
                }
            }else{
                console.log('ballotController : contractAddr is null or empty');
                return res.json({status: 'Error',  message : 'contractAddr is null or empty'});
            }
        }
        catch(err)
        {
            throw err;
        }
        console.log('ballotController : getPartyVoteCount method ends');
    },


    isValidAdhar : function(req, res){
        console.log('ballotController : isValidAdhar method begins');
        let adharnumber =  req.body.adharNumber;
        console.log('ballotController : adharnumber ='+ adharnumber);
        if(adharnumber != null){
            console.log('ballotController : Before calling   adharvalidator.isValidNumber()');
            var isValid = adharvalidator.isValidNumber(adharnumber);
            console.log('ballotController : After calling   adharvalidator.isValidNumber() isValid = '+ isValid);
            return res.json({status: 'Success' , message : isValid});  
        }
    }


}

module.exports = ballotController;