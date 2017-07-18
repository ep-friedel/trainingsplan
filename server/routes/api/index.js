const 	routes 		    = require('express').Router()
    /*,   auth 		       = require('./modules/auth')()*/
	,	registration 	= require('./registration')
	,	github 		    = require('./github');

routes.use('/github', github);

routes.get('/', (req, res) => {
  res.status(200).json({ message: 'Connected!' });
});

routes.use('/registration', /*auth.checkToken({type: 'api'}),*/ registration);

module.exports = routes;