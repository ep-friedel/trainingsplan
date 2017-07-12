const	key = require('express').Router(),
		crypto = require(process.env.EVENT_HOME + 'modules/crypto')();

key.get('/', (req, res) => {
	crypto.getPublicKey()
	.then(key => {
		res.status(200).json({success: true, data: key});
	}).catch(console.log);
});

module.exports = key;