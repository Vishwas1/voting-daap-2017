var express = require('express'),
	router = express.Router(),
	usrController = require('./controllers/userController'),
//	locController = require('./controllers/locationController'),
	common = require('../common/common'),
	ballotCtrl = require('./controllers/ballotController');

router.post('/admin-create',usrController.create); //routes for creating a user
router.post('/admin-login',usrController.login); //route for login 

// router.get('/locList',common.ensureToken,locController.fetchLocation); //routes for getting location list 
// router.post('/loc',common.ensureToken,locController.addLocation); //routes to insert a location
 
/**
 * Title : newballot
 * Description : this api is used to create a new smart contract instance on ehterum
 * Input : contract name, end time
 */
router.post('/create-ballot',ballotCtrl.create);
 
/**
 * Title : addparty
 * Description : this api is used to create a new smart contract instance on ehterum
 * Input : contract name, end time
 */
router.post('/add-party',ballotCtrl.addParty); 

/**
 * Title : getadmincontracts
 * Description : this api is used to create a new smart contract instance on ehterum
 * Input : adhar number
 */
router.post('/ballot-list',usrController.getBallotList); 

/**
 * Title : addvoter
 * Description : this api is used to create a new smart contract instance on ehterum
 * Input : contract name, end time
 */
router.post('/add-voter',ballotCtrl.addVoter);  

/**
 * Title : getlistofparties
 * Description :Get list of parties. 
 * Input : contract name, end time
 */
router.post('/parties-list',ballotCtrl.getListOfParties);  

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
router.post('/vote',ballotCtrl.doVoting); 

/**
 * Title : getPartyVoteCount
 * Description : get totoal vote count
 * Input : party id
 */
router.post('/vote-count',ballotCtrl.getPartyVoteCount);

/**
 * Title : getPartyVoteCount
 * Description : get totoal vote count
 * Input : party id
 */
router.post('/validate-adhar',ballotCtrl.isValidAdhar);

/**
 *  ------------Sample APIS-------------------
 * http://localhost:3000/api/create-ballot
 * http://localhost:3000/api/addparty
 * http://localhost:3000/api/parties-list
 * http://localhost:3000/api/add-voter
 * http://localhost:3000/api/validate-voter
 * http://localhost:3000/api/vote
 * http://localhost:3000/api/vote-count
 * http://localhost:3000/api/validate-adhar
 * http://localhost:3000/api/ballot-list
 * http://localhost:3000/api/admin-create
 * http://localhost:3000/api/admin-login
 * 
 */



module.exports =router;

	 
