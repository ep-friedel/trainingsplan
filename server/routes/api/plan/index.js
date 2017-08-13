const	plan 	= require('express').Router()
    ,   planDB  = require(process.env.TRAINER_HOME + 'modules/db/plan')
    ,   jwt         = require(process.env.TRAINER_HOME + 'modules/auth/jwt')
    ,   error       = require(process.env.TRAINER_HOME + 'modules/error')
    ,   image       = require('./image');

plan.use('/image', jwt.requireAuthentication, image);

plan.get('/',
    jwt.requireAuthentication,
    (req, res) => {
        planDB.getAllPlans()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(error.router.internalError(res));
    }
);

plan.post('/',
    error.router.validate('body', {
        name: /^[ÄÜÖäöüA-Za-z0-9\s]{5,50}$/,
        imageUrl: /^[\S]{0,150}$/
    }),
    jwt.requireAuthentication,
    (req, res) => {
        let action;
        planDB.savePlan(req.body)
        .then(() => {
            res.status(200).send();
        })
        .catch(error.router.internalError(res));
    }
);

plan.get('/:id',
    error.router.validate('params', {
        id: /^[0-9]{1,10}$/
    }),
    jwt.requireAuthentication,
    (req, res) => {
        planDB.getPlanByProperty('id', req.params.id)
        .then(result => {
            res.status(200).json(result);
        })
        .catch(error.router.internalError(res));
    }
);



module.exports = plan;