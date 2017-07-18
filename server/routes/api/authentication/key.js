const	key 		= require('express').Router()
	,	KS 			= require(process.env.EVENT_HOME + 'modules/db/keystore')
	,	crypto 		= require(process.env.EVENT_HOME + 'modules/crypto')()
	,	error 		= require(process.env.EVENT_HOME + 'modules/error');

key.get('/', KS.getPkey, (req, res) => {
	if (req.pkey) {
		crypto.encode({
			data: req.pkey,
			users: [req.username]
		}).then((encObj) => {
	    	res.status(200).json({
	    		success: true,
	    		data: encObj.encryptedText,
	    		key: encObj.encryptedKeys[req.username]
	    	});
		})
		.catch(error.router.internalError(res));
	} else {
		res.status(403).json({success: false});
	}
});

key.post('/', (req, res) => {

    res.status(200).json({success: true});
});

key.put('/', (req, res) => {

    res.status(200).json({success: true});
});

module.exports = key;