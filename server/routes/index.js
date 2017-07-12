const 	routes 		= require('express').Router()
    /*,   auth 		= require('./modules/auth')()*/
	,	user 		= require('./user')
	,	key 		= require('./key')
	,	github 		= require('./github');

routes.use('/github', github);

routes.get('/api', (req, res) => {
  res.status(200).json({ message: 'Connected!' });
});

routes.use('/api/user', /*auth.checkToken({type: 'api'}),*/ user);
routes.use('/api/key', key);

module.exports = routes;