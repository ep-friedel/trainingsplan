const   plan        = require('express').Router()
    ,   trainingDB      = require(process.env.TRAINER_HOME + 'modules/db/training')
    ,   jwt         = require(process.env.TRAINER_HOME + 'modules/auth/jwt')
    ,   error       = require(process.env.TRAINER_HOME + 'modules/error');

plan.get('/',
    jwt.requireAuthentication,
    (req, res) => {
        trainingDB.getAllPlans(req.user.id)
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
        trainingDB.savePlan(req.user.id, req.body)
        .then(() => {
            res.status(200).send();
        })
        .catch(error.router.internalError(res));
    }
);

plan.get('/:id/exercises',
    error.router.validate('params', {
        id: /^[0-9]{1,10}$/
    }),
    jwt.requireAuthentication,
    (req, res) => {
        trainingDB.getExerciseDetailsByPlanId(req.user.id, req.params.id)
        .then(result => {
            res.status(200).json(result);
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
        trainingDB.getPlanByProperty(req.user.id, 'userPlans.id', req.params.id)
        .then(result => {
            res.status(200).json(result[0]);
        })
        .catch(error.router.internalError(res));
    }
);

module.exports = plan;