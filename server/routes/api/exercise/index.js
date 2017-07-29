const	exercise 	= require('express').Router()
    ,   exerciseDB  = require(process.env.TRAINER_HOME + 'modules/db/exercise')
    ,   jwt         = require(process.env.TRAINER_HOME + 'modules/auth/jwt')
    ,   error       = require(process.env.TRAINER_HOME + 'modules/error')
    ,   image       = require('./image');

exercise.use('/image', jwt.requireAuthentication, image);

exercise.get('/',
    jwt.requireAuthentication,
    (req, res) => {
        exerciseDB.getAllExercises()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(error.router.internalError(res));
    }
);

exercise.post('/',
    error.router.validate('body', {
        name: /^[A-Za-z0-9\s]{5,50}$/,
        imageUrl: /^[\S]{0,150}$/,
        machine: /^[A-Za-z0-9\s]{0,50}$/
    }),
    jwt.requireAuthentication,
    (req, res) => {
        exerciseDB.createExercise(req.body)
        .then(() => {
            res.status(200).send();
        })
        .catch(error.router.internalError(res));
    }
);

exercise.get('/:id',
    error.router.validate('params', {
        id: /^[0-9]{1,10}$/
    }),
    jwt.requireAuthentication,
    (req, res) => {
        exerciseDB.getExerciseByProperty('id', req.params.id)
        .then(result => {
            res.status(200).json(result);
        })
        .catch(error.router.internalError(res));
    }
);



module.exports = exercise;