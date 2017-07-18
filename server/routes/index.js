const 	routes 		= require('express').Router()
    /*,   auth 		= require('./modules/auth')()*/
	,	api 		= require('./api');

routes.use('/api', /*auth.validateRequest,*/ api);

module.exports = routes;