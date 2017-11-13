//getting instance of mongooes and Schema
var mongoose =  require('mongoose');
var Schema = mongoose.Schema;


//set up model for user and pass it to export
module.exports = mongoose.model('User_1',new Schema({
	username : String,
	password : String,
	publickey : String,
	adharnum : String
}));




