const	registration 	= require('express').Router()
	,	userDB 			= require(process.env.TRAINER_HOME + 'modules/db/user')
	,	error 			= require(process.env.TRAINER_HOME + 'modules/error')
	,	log				= require(process.env.TRAINER_HOME + 'modules/log')
	, 	crypto  		= require(process.env.TRAINER_HOME + 'modules/crypto');


registration.post('/', error.router.validate('body', {
	user: /^[A-Za-z0-9\s]{5,50}$/,
	hash: /^[A-Za-z0-9\s/+]*$/
}), (req, res) => {
	log(6, 'Creating User')

	crypto.createUserHash(req.body.hash)
	.then(hashObj => {
		console.log(hashObj);

		return userDB.createUser({
		name: req.body.user, 
		hash: hashObj.hash, 
		salt: hashObj.salt,
		role: 'user'
	})})
	.then((result) => {
		if (result.success) {
			res.status(200).send({
				user: {
					id: result.user.id,
					name: result.user.name,
					role: result.user.role
				},
				plans: []
			});
		} else {
			log(3, 'Failed creating user. error: ', result.message);
			res.status(result.status).send(result.message);
		}
	})
	.catch(error.router.internalError);
});

module.exports = registration;