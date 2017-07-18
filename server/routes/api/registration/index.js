const	registration 	= require('express').Router()
	,	userDB 			= require(process.env.TRAINER_HOME + 'modules/db/user')
	,	error 			= require(process.env.TRAINER_HOME + 'modules/error');


registration.post('/', error.router.validate({
	user: /^[A-Za-z0-9\s]{5,25}$/,
	hash: /^[A-Za-z0-9\s]*$/
}), (req, res) => {
	userDB.createUser({user: req.body.user, pass: req.body.hash, role: 'user'})
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
			res.status(400).send(result.message);
		}
	})
	.catch(error.router.internalError);
});

module.exports = registration;