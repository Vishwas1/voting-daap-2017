var	ethconfig = require('../configs/ethConfig');
var Web3 = require('web3');

var web3Meth = function (){
	var web3;
	if (typeof web3 !== 'undefined') {		
		web3 = new Web3(web3.currentProvider);
		console.log("web3Conn :: web3 is connected through currentProvider.");
	} else {
		console.log("web3Conn :: web3 == undefined");

		console.log("web3Conn :: Before connting to endpoint");
		web3 = new Web3(new Web3.providers.HttpProvider(ethconfig.endpoints.dev));
		console.log("web3Conn :: After connting to endpoint, web3 = "+ web3.eth.accounts);
		console.log(web3.eth.accounts[0]);
	}
	return web3;
}

module.exports.web3Meth = web3Meth;