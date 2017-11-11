var env = require('../environment');

var config = {
	port : env.environment === 'development' ? process.env.PORT || 3000 : process.env.PORT || 80,
	secret : 'vishwasbanand',
	database : 'mongodb://admin:mongo2017@vishwascluster-shard-00-00-g2gj6.mongodb.net:27017,vishwascluster-shard-00-01-g2gj6.mongodb.net:27017,vishwascluster-shard-00-02-g2gj6.mongodb.net:27017/test?ssl=true&replicaSet=VishwasCluster-shard-0&authSource=admin',
	appName : 'Voting Daap',
}


module.exports = config

