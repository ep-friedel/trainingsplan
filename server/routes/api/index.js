const 	routes 		    = require('express').Router()
    ,   jwt 		    = require(process.env.TRAINER_HOME + '/modules/auth/jwt')
	,	registration 	= require('./registration')
	,	authentication 	= require('./authentication')
    ,   user            = require('./user')
	,	exercise 		= require('./exercise')
	,	plan 			= require('./plan')
	,	userplans 		= require('./userplans')
	,	github 		    = require('./github');

routes.use('/github', github);

routes.get('/', (req, res) => {
  res.status(200).json({ message: 'Connected!' });
});

routes.use('/authentication', authentication);
routes.use('/registration', registration);
routes.use('/user', jwt.checkToken, user);
routes.use('/exercise', jwt.checkToken, exercise);
routes.use('/plan', jwt.checkToken, plan);
routes.use('/userplans', jwt.checkToken, userplans);

module.exports = routes;