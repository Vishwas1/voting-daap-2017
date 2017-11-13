//getting instance of mongooes and Schema
var mongoose =  require('mongoose');
var Schema = mongoose.Schema;

//some comment
//set up model for user and pass it to export
module.exports = mongoose.model('Contract_1',new Schema({
	adharnum : String,
	contractaddr : String,
	contractname : String,
	contractStartTime : String,
	contractEndTime : String,

}));



