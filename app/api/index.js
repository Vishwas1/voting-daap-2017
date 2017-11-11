var express = require('express'),
	router = express.Router(),
	usrController = require('./userController'),
	locController = require('./locationController'),
	common = require('../common/common'),
// <<<<<<< HEAD
// 	ballotCtrl = require('./locationController');
// =======
	ballotCtrl = require('./ballotController');
// >>>>>>> b0d7e3c0e4a6dd3ce62dc39f63059468b88fc5cf


router.post('/create',usrController.create); //routes for creating a user
router.post('/login',usrController.login); //route for login 
router.get('/locList',common.ensureToken,locController.fetchLocation); //routes for getting location list 
router.post('/loc',common.ensureToken,locController.addLocation); //routes to insert a location


router.post('/newballot',ballotCtrl.create); //route for login 

module.exports =router;
