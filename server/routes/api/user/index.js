const	user 	    = require('express').Router()
	,	userDB 		= require(process.env.TRAINER_HOME + 'modules/db/user')
    ,   jwt         = require(process.env.TRAINER_HOME + 'modules/auth/jwt')
	,	error 		= require(process.env.TRAINER_HOME + 'modules/error');


user.get('/:user', error.router.validate('params', {
	user: /^[A-Za-z0-9\s]{4,50}$/
}), jwt.requireAuthentication, (req, res) => {
    let userRequest;

    if (req.params.user === 'self') {
        userRequest = Promise.resolve(req.user);
    } else {
        userRequest = userDB.getUserObjectByProperty('name', req.params.user);
    }

	userRequest.then((userObject) => {
		res.status(200).send(userObject);
	})
	.catch(error.router.internalError);
});

module.exports = user;