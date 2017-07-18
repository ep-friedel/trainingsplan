const	user 		= require('express').Router()
	,	userDB 		= require(process.env.TRAINER_HOME + 'modules/db/user')
	,	error 		= require(process.env.TRAINER_HOME + 'modules/error');

user.param('username', (req, res, next, value) => {
	req.username = value;
	next();
})

user.get('/:username', (req, res) => {
	userDB.getUserObjectByUsername([req.params.username])
		.then(userObject => {
    		res.status(200).json(userObject);
		})
		.catch(error.router.internalError(res));
});

module.exports = user;