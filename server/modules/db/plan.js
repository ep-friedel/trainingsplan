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
            acc[row.id].exercises.push({
                id: row.exerciseId,
                planExerciseId: row.planExerciseId,
                name: row.exerciseName,
                imageUrl: row.exerciseImageUrl,
                machine: row.exerciseMachine,
                position: row.exercisePosition,
                repetitions: row.exerciseRepetitions,
                sets: row.exerciseSets
            })
        } else {
            acc[row.id] = {
                id: row.id,
                name: row.name,
                imageUrl: row.imageUrl,
                note: row.note,
                exercises: (row.exerciseId !== null) ? [{
                    id: row.exerciseId,
                    planExerciseId: row.planExerciseId,
                    name: row.exerciseName,
                    imageUrl: row.exerciseImageUrl,
                    machine: row.exerciseMachine,
                    position: row.exercisePosition,
                    repetitions: row.exerciseRepetitions,
                    sets: row.exerciseSets
                }] : []
            }
        }

        return acc;
    }, {});

    for (runvar in reducedResult) {
        arrayResult.push(reducedResult[runvar]);
    }

    return arrayResult;
}

function reduceExercisesAndSetup(rows) {
    let reducedResult,
        arrayResult = [],
        runvar,
        runvar2;

    reducedResult = rows.reduce((acc, row) => {
        if (acc[row.id]) {

            if (acc[row.id].exercisesObj[row.exerciseId]) {
                acc[row.id].exercisesObj[row.exerciseId].setup[row.exerciseSetupSetting] = row.exerciseSetupType;
            } else {
                acc[row.id].exercisesObj[row.exerciseId] = {
                    id: row.exerciseId,
                    planExerciseId: row.planExerciseId,
                    name: row.exerciseName,
                    imageUrl: row.exerciseImageUrl,
                    machine: row.exerciseMachine,
                    position: row.exercisePosition,
                    repetitions: row.exerciseRepetitions,
                    sets: row.exerciseSets,
                    setup: {[row.exerciseSetupSetting]: row.exerciseSetupType}
                };
            }
        } else {

            acc[row.id] = {
                id: row.id,
                name: row.name,
                imageUrl: row.imageUrl,
                note: row.note,
                exercisesObj: (row.exerciseId !== null) ? {[row.exerciseId]: {
                    id: row.exerciseId,
                    planExerciseId: row.planExerciseId,
                    name: row.exerciseName,
                    imageUrl: row.exerciseImageUrl,
                    machine: row.exerciseMachine,
                    position: row.exercisePosition,
                    repetitions: row.exerciseRepetitions,
                    sets: row.exerciseSets,
                    setup: {[row.exerciseSetupSetting]: row.exerciseSetupType}
                }} : []
            }
        }

        return acc;
    }, {});

    for (runvar in reducedResult) {
        reducedResult[runvar].exercises = [];

        for (runvar2 in reducedResult[runvar].exercisesObj) {
            reducedResult[runvar].exercises.push(reducedResult[runvar].exercisesObj[runvar2]);
        }

        delete reducedResult[runvar].exercisesObj;

        arrayResult.push(reducedResult[runvar]);
    }

    return arrayResult;
}

module.exports = {
    getPlanByProperty: (property, value) => {
        const query = `
            SELECT
                plans.id,
                plans.name,
                plans.imageUrl,
                plans.note,
                planExercises.position AS exercisePosition,
                planExercises.repetitions AS exerciseRepetitions,
                planExercises.sets AS exerciseSets,
                exercises.id AS exerciseId,
                exercises.name AS exerciseName,
                exercises.imageUrl AS exerciseImageUrl,
                exercises.machine AS exerciseMachine
            FROM plans
            LEFT JOIN planExercises
            ON plans.id = planExercises.planId
            LEFT JOIN exercises
            ON planExercises.exerciseId = exercises.id
            WHERE plans.${property} = "${value}";`;

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

    getFullPlanByProperty: (property, value) => {
        const query = `
            SELECT
                plans.id,
                plans.name,
                plans.imageUrl,
                plans.note,
                planExercises.position AS exercisePosition,
                planExercises.repetitions AS exerciseRepetitions,
                planExercises.sets AS exerciseSets,
                exercises.id AS exerciseId,
                exercises.name AS exerciseName,
                exercises.imageUrl AS exerciseImageUrl,
                exercises.machine AS exerciseMachine,
                exerciseSetup.setting AS exerciseSetupSetting,
                exerciseSetup.type AS exerciseSetupType
            FROM plans
            LEFT JOIN planExercises
            ON plans.id = planExercises.planId
            LEFT JOIN exercises
            ON planExercises.exerciseId = exercises.id
            LEFT JOIN exerciseSetup
            ON exerciseSetup.exerciseId = exercises.id
            WHERE plans.${property} = "${value}";`;

        return getConnection()
        .then (myDb => {
            return new Promise((resolve, reject) => myDb.query(query, (err, result) => {
                myDb.release();
                if (err) {
                    log(2, 'Failed loading the plan', err, query);
                    reject({status: 500, message: 'Unable to get plan.'});
                } else {
                    log(6, 'got full plan');
                    resolve(reduceExercisesAndSetup(result));
                }
            }));
        });
    },

    savePlan: (options) => {
        const queries = {
            plan: `INSERT INTO plans (
                            name,
                            imageUrl,
                            note
                            ${options.id ? ', id' : ''}
                        ) VALUES
                        (
                            ${mysql.escape(options.name)},
                            ${mysql.escape(options.imageUrl)},
                            ${mysql.escape(options.note)}
                            ${(options.id !== undefined) ? ', ' + mysql.escape(options.id) : ''}
                        )
                        ON DUPLICATE KEY UPDATE
                        \`name\`=VALUES(\`name\`),
                        \`imageUrl\`=VALUES(\`imageUrl\`),
                        \`note\`=VALUES(\`note\`);`,

            setupDelete: `DELETE FROM planExercises
                          WHERE planId = ${mysql.escape(options.id)}
                          ${(options.exercises.length) ? ('AND NOT id IN (' + options.exercises.map(ex => mysql.escape(ex.id)).join(', ') + ')') : ''};`,

            deleteUserPlanExerciseSettings: `DELETE userPlanExerciseSettings.*
                FROM userPlanExerciseSettings
                LEFT JOIN userPlans
                ON userPlanExerciseSettings.userPlanId = userPlans.id
                WHERE userPlans.planId = ${mysql.escape(options.id)}
                ${(options.exercises.length) ? ('AND NOT userPlanExerciseSettings.exerciseId IN (' + options.exercises.map(ex => mysql.escape(ex.id)).join(', ') + ')') : ''};`,

            deleteUserPlanSettings: `DELETE userPlanSettings.*
                FROM userPlanSettings
                LEFT JOIN userPlans
                ON userPlanSettings.userPlanId = userPlans.id
                WHERE userPlans.planId = ${mysql.escape(options.id)}
                ${(options.exercises.length) ? ('AND NOT userPlanSettings.exerciseId IN (' + options.exercises.map(ex => mysql.escape(ex.id)).join(', ') + ')') : ''};`,

            exercises: (exercises, id) => {
                let insertString = exercises.map((exercise, index) => `(
                    ${mysql.escape(id)},
                    ${mysql.escape(exercise.id)},
                    ${mysql.escape(exercise.sets)},
                    ${mysql.escape(exercise.repetitions)},
                    ${mysql.escape(index * 10)}
                )`).join(', ');


                return `INSERT INTO planExercises (
                        planId,
                        exerciseId,
                        sets,
                        repetitions,
                        position
                    ) VALUES
                    ${insertString}
                    ON DUPLICATE KEY UPDATE
                        \`repetitions\`=VALUES(\`repetitions\`),
                        \`sets\`=VALUES(\`sets\`),
                        \`position\`=VALUES(\`position\`);`
            }
        };
        let myDb;

        return getConnection()
        .then (Db => {
            myDb = Db;

            return new Promise((resolve,reject) => {
                myDb.query(queries.plan, (err, result) => {
                    if (err) {
                        log(2, 'Failed creating the plan', err, queries.plan);
                        reject({status: 500, message: 'Error inputing basic plan data'});
                    } else {
                        resolve(result);
                    }
                });
            })
        })
        .then((oldResult) => {
            if (options.id !== undefined) {
                log(6, 'Plan updated, deleting removed exercises');
                return Promise.all(['setupDelete', 'deleteUserPlanExerciseSettings', 'deleteUserPlanSettings']
                    .map(myQuery => new Promise((resolve, reject) => myDb.query(queries[myQuery], (err, result) => {
                        if (err) {
                            log(2, 'Failed emptying setup table', err, queries[myQuery]);
                            reject({status: 500, message: 'Error emptying setup table'});
                        }
                        resolve();
                    })))
                ).then(() => options.id);
            } else {
                log(6, 'Plan created');
                return Promise.resolve(oldResult.insertId);
            }
        })
        .then(planId => {
            log(6, 'Got Id, inserting exercise list');
            return new Promise((resolve, reject) => {
                myDb.query(queries.exercises(options.exercises, planId), (err, result) => {
                    myDb.release();
                    if (err) {
                        log(2, 'Failed inserting setup settings', err, queries.exercises(options.exercises, planId));
                        reject({status: 500, message: 'Error inserting setup settings'});
                    } else {
                        resolve({success: true});
                    }
                });
            });
        })
        .catch(err => {
            myDb.release();
            if (err && err.status) {
                err.success = false;
                return err;
            }

            return error.db.codeError('modules/db/plan.js:createPlan', err);
        });

    },

    getAllPlans: () => {
        const query = `
            SELECT
                plans.id,
                plans.name,
                plans.imageUrl,
                plans.note,
                planExercises.id AS planExerciseId,
                planExercises.position AS exercisePosition,
                planExercises.repetitions AS exerciseRepetitions,
                planExercises.sets AS exerciseSets,
                exercises.id AS exerciseId,
                exercises.name AS exerciseName,
                exercises.imageUrl AS exerciseImageUrl,
                exercises.machine AS exerciseMachine
            FROM plans
            LEFT JOIN planExercises
            ON plans.id = planExercises.planId
            LEFT JOIN exercises
            ON planExercises.exerciseId = exercises.id;`;

        return getConnection()
        .then (myDb => {
            return new Promise((resolve, reject) => myDb.query(query, (err, result) => {
                myDb.release();
                if (err) {
                    log(2, 'Failed loading plan', err, query);
                    reject({status: 500, message: 'Unable to get plan.'});
                } else {
                    resolve(reduceToExerciseObjectArray(result));
                }
            }));
        });
    }
}