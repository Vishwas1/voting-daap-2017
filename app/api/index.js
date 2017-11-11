var express = require('express'),
	router = express.Router(),
	usrController = require('./controllers/userController'),
	locController = require('./controllers/locationController'),
	common = require('../common/common'),
	ballotCtrl = require('./controllers/ballotController');


router.post('/create',usrController.create); //routes for creating a user
router.post('/login',usrController.login); //route for login 
router.get('/locList',common.ensureToken,locController.fetchLocation); //routes for getting location list 
router.post('/loc',common.ensureToken,locController.addLocation); //routes to insert a location
 
/**
 * Title : newballot
 * Description : this api is used to create a new smart contract instance on ehterum
 * Input : contract name, end time
 */
router.post('/newballot',ballotCtrl.create);
 
/**
 * Title : addparty
 * Description : this api is used to create a new smart contract instance on ehterum
 * Input : contract name, end time
 */
router.post('/addparty',ballotCtrl.addParty); //route for new ballot creation 

/**
 * Title : addvoter
 * Description : this api is used to create a new smart contract instance on ehterum
 * Input : contract name, end time
 */
router.post('/addvoter',ballotCtrl.addVoter);  

/**
 * Title : getlistofparties
 * Description : this api is used to create a new smart contract instance on ehterum
 * Input : contract name, end time
 */
router.post('/validate-voter',ballotCtrl.validateVoter);  

/**
 * Title : getlistofparties
 * Description : this api is used to create a new smart contract instance on ehterum
 * Input : contract name, end time
 */
router.post('/getList-of-parties',ballotCtrl.getListOfParties);  

/**
 * Title : getlistofparties
 * Description : this api is used to create a new smart contract instance on ehterum
 * Input : contract name, end time
 */
router.post('/do-voting',ballotCtrl.doVoting); //not implemented

/**
	 *  validateBallotVoter(string _adharNumber)
     *  getListOfParties() public constant returns(bytes32[]) 
     *  doVoting(uint _partyId) public  returns(bool)
     *  getTotalVoteCountOfParty(uint _partyId) public constant returns(uint){
	 * 
	 */


module.exports =router;
