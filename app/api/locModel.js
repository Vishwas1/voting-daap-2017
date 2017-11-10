//getting instance of mongooes and Schema
var mongoose =  require('mongoose');
var Schema = mongoose.Schema;


//set up model for user and pass it to export
module.exports = mongoose.model('Location1',new Schema({
	username : String,
	address : String,
	longitude : String,
	latitude : String
}));



