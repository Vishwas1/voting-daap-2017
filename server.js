var express = require('express'),
 app = express(),
 config = require('./config'),
 port = config.port,
 bodyparser = require('body-parser'),
 morgan = require('morgan'),
 mongoose =require('mongoose'),
 mongoClient = require('mongodb').MongoClient,
 jwt = require('jsonwebtoken'),
 dbConn = require('./dbConn'),
 Web3 = require('web3');


 // Setting up connection with ethereum 
 if (typeof web3 !== 'undefined') {
	var web3 = new Web3(web3.currentProvider)
  } else {
	var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
  }


//Navigation

// var nav = [	{
// 				Link : '/login',
// 				Text : 'Login'
// 			},
// 			{
// 				Link : '/signup',
// 				Text : 'Signup'
// 		 	}
// 		 ];

//connecting to db
mongoose.Promise = require('bluebird');
console.log('server : Before calling  DbConnection method');
dbConn.connection().then(function(res){
	console.log('server : Connected to Db');
	global.dbConnection = true;
	global.dbQueryObj = res;
}).catch(function(err){
	console.log('server :Error Connected to Db res ='+err);
	global.dbConnection = false;
});


//setting secret variable 
console.log('server : Before setting secret key:' + config.secret);
app.set('superSecret',config.secret);
console.log('server : After setting secret key');

//body-parser to get infos from POST URL parameters
app.use(bodyparser.urlencoded({extended : false}));
app.use(bodyparser.json());

//morgan to log requests to the console
app.use(morgan('dev'));

// going to be used by express first
app.use(express.static('public')); 

//View Engine
app.set('views','./app/views');
app.set('view engine','ejs');

//Routes configuration ...
app.get('/',function(req,res){res.render('login',{title:'E-Voting | Login'});});
// app.get('/login',function(req,res){res.render('login',{title:'Login Page', nav : nav, appName:  config.appName });});
app.get('/register',function(req,res){res.render('register',{title:'E-Voting | Register'});});
app.get('/ballot',function(req,res){res.render('ballot',{title:'E-Voting | Create Ballot'});});
app.use('/api', require('./app/api'));


//listen and start the server
app.listen(port);
console.log('Server is up and running at port:'+port);

