const	exercise 	= require('express').Router()
    ,   jwt         = require(process.env.TRAINER_HOME + 'modules/auth/jwt')
    ,   image        = require('./image')
	,	error 		= require(process.env.TRAINER_HOME + 'modules/error');

exercise.use('/image', jwt.requireAuthentication, image);

exercise.get('/:id', jwt.requireAuthentication, (req, res) => {
    res.status(200).send(req.params.id);
});



module.exports = exercise;