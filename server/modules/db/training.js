const   getConnection   = require(process.env.TRAINER_HOME + 'modules/db')
    ,   mysql           = require('mysql')
    ,   log             = require(process.env.TRAINER_HOME + 'modules/log')
    ,   error           = require(process.env.TRAINER_HOME + 'modules/error');

function reduceToExerciseObjectArray(result) {
    let reducedResult,
        arrayResult = [],
        runvar;

    reducedResult = result.reduce((acc, row) => {
        if (acc[row.id]) {
            acc[row.id].setup[row.exerciseSetupKey] = row.exerciseSetupValue;
        } else {
            let newObj = {}

            if (row.exerciseSetupKey) {
                newObj[row.exerciseSetupKey] = row.exerciseSetupValue;
            }

            acc[row.id] = {
                    id: row.id,
                    position: row.position,
                    name: row.exerciseName,
                    imageUrl: row.exerciseImageUrl,
                    machine: row.exerciseMachine,
                    note: row.exerciseNote,
                    setup: newObj
                }
        }

        return acc;
    }, {});

    for (runvar in reducedResult) {
        arrayResult.push(reducedResult[runvar]);
    }

    return arrayResult;
}


module.exports = {
    getExerciseDetailsByPlanId: (userId, planId) => {
        const query = `
            SELECT
                planExercises.exerciseId AS id,
                planExercises.position,
                planExercises.repetitions,
                exercises.name AS exerciseName,
                exercises.imageUrl AS exerciseImageUrl,
                exercises.machine AS exerciseMachine,
                exerciseSetup.setting AS exerciseSetupKey,
                userPlanSettings.value AS exerciseSetupValue,
                COALESCE(NULLIF(planExercises.note,''), exercises.note) AS exerciseNote
            FROM userPlans
            LEFT JOIN planExercises
            ON userPlans.planId = planExercises.planId
            LEFT JOIN exercises
            ON planExercises.exerciseId = exercises.id
            LEFT JOIN userPlanSettings
            ON userPlanSettings.exerciseId = exercises.id
            AND userPlanSettings.userId = "${userId}"
            AND userPlanSettings.userPlanId = userPlans.id
            LEFT JOIN exerciseSetup
            ON exerciseSetup.exerciseId = exercises.id
            AND exerciseSetup.id = userPlanSettings.settingId
            WHERE userPlans.userId = "${userId}"
            AND userPlans.id = "${planId}";`;

        return getConnection()
        .then (myDb => {
            return new Promise((resolve, reject) => myDb.query(query, (err, result) => {
                myDb.release();
                if (err) {
                    log(2, 'Failed loading the plan', err, query);
                    reject({status: 500, message: 'Unable to get plan.'});
                } else {
                    resolve(reduceToExerciseObjectArray(result));
                }
            }));
        });
    },

    savePlan: (userId, options) => {
        const queries = {
            plan: `INSERT INTO userPlans (
                            ${options.id ? 'id,' : ''}
                            userId,
                            planId,
                            active,
                            note
                        ) VALUES
                        (
                            ${(options.id !== undefined) ? mysql.escape(options.id) + ', ' : ''}
                            ${mysql.escape(userId)},
                            ${mysql.escape(options.planId)},
                            ${mysql.escape(options.active)},
                            ${mysql.escape(options.note)}
                        )
                        ON DUPLICATE KEY UPDATE
                        \`userId\`=VALUES(\`userId\`),
                        \`planId\`=VALUES(\`planId\`),
                        \`active\`=VALUES(\`active\`),
                        \`note\`=VALUES(\`note\`);`,

            deleteUserPlanSettings: (exercises) =>  {
                let exerciseDeleteConditionString = exercises.map(exercise => 
                        `(exerciseId = ${mysql.escape(exercise.id)} 
                        ${Object.keys(exercise.setup).length ? ('AND NOT settingId IN (' + mysql.escape(Object.keys(exercise.setup)) + ')') : ''})`
                    ).join(' OR ');

                return `DELETE FROM userPlanSettings 
                    WHERE userPlanId = ${mysql.escape(options.id)}
                    AND ${exerciseDeleteConditionString};`
            },

            settings: (exercises) => {
                let insertString = exercises.map(exercise => Object.keys(exercise.setup).map(setupKey => `(
                        ${mysql.escape(userId)},
                        ${mysql.escape(options.id)},
                        ${mysql.escape(exercise.id)},
                        ${mysql.escape(setupKey)},
                        ${mysql.escape(exercise.setup[setupKey])}
                    )`).join(', ')).join(', ');

                return `INSERT INTO userPlanSettings (
                        userId,
                        userPlanId,
                        exerciseId,
                        settingId,
                        value
                    ) VALUES
                    ${insertString}
                    ON DUPLICATE KEY UPDATE
                        \`value\`=VALUES(\`value\`);`
            }
        };

        return getConnection()
        .then (myDb => {
            return new Promise((resolve,reject) => {
                myDb.query(queries.plan, (err, result) => {
                    if (err) {
                        log(2, 'Failed creating the userPlan', err, queries.plan);
                        reject({status: 500, message: 'Error inputing basic userPlan data'});
                    } else {
                        resolve();
                    }
                });
            })
            .then(() => {
                if (options.id !== undefined) {
                    log(6, 'UserPlan updated, deleting removed userPlanSettings');
                    return new Promise((resolve, reject) => {
                        myDb.query(queries.deleteUserPlanSettings(options.exercises), (err, result) => {
                            if (err) {
                                log(2, 'Failed emptying userPlanSettings table', err, queries.setupDelete);
                                reject({status: 500, message: 'Error emptying userPlanSettings table'});
                            }
                            log(6, 'Cleaned all userPlanSettings');
                            resolve(options.id);
                        });
                    });
                } else {
                    log(6, 'UserPlan created');
                    return Promise.resolve(result.insertId);
                }
            })
            .then(id => {
                log(6, 'Got Id, inserting userPlanSettings');

                return new Promise((resolve, reject) => {
                    myDb.query(queries.settings(options.exercises), (err, result) => {
                        if (err) {
                            log(2, 'Failed inserting userPlanSettings', err, queries.setupDelete);
                            reject({status: 500, message: 'Error inserting userPlanSettings'});
                        }
                        log(6, 'Finished inserting userPlanSettings');
                        resolve();
                    });
                });
            })
            .then(() => {
                myDb.release();
                return {success: true};
            })
            .catch(err => {
                myDb.release();
                throw err;
            });
        })
        .catch(err => {
            if (err && err.status) {
                err.success = false;
                return err;
            }

            return error.db.codeError('modules/db/plan.js:createPlan', err);
        });
    },

    getAllPlans: (userId) => {
        const query = `
            SELECT
                userPlans.id,
                userPlans.active,
                userPlans.planId,
                plans.imageUrl,
                plans.name,
                COALESCE(NULLIF(userPlans.note,''), plans.note) AS note
            FROM userPlans
            LEFT JOIN plans
            ON userPlans.planId = plans.id
            WHERE userPlans.userId = "${userId}";`;

        return getConnection()
        .then (myDb => {
            return new Promise((resolve, reject) => myDb.query(query, (err, result) => {
                myDb.release();
                if (err) {
                    log(2, 'Failed loading plan', err, query);
                    reject({status: 500, message: 'Unable to get plan.'});
                } else {
                    resolve(result);
                }
            }));
        });
    },

    getPlanByProperty: (userId, property, value) => {
        const query = `
            SELECT
                userPlans.id,
                userPlans.active,
                userPlans.planId,
                plans.imageUrl,
                plans.name,
                COALESCE(NULLIF(userPlans.note,''), plans.note) AS note
            FROM userPlans
            LEFT JOIN plans
            ON userPlans.planId = plans.id
            WHERE userPlans.userId = "${userId}"
            AND ${property} = "${value}";`;

        return getConnection()
        .then (myDb => {
            return new Promise((resolve, reject) => myDb.query(query, (err, result) => {
                myDb.release();
                if (err) {
                    log(2, 'Failed loading plan', err, query);
                    reject({status: 500, message: 'Unable to get plan.'});
                } else {
                    resolve(result);
                }
            }));
        });
    }
}