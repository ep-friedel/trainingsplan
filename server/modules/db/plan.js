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
                position: row.exercisePosition
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
                    position: row.exercisePosition
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

module.exports = {
    getPlanByProperty: (property, value) => {
        const query = `
            SELECT
                plan.id,
                plan.name,
                plan.imageUrl,
                plan.note,
                planExercises.position AS exercisePosition,
                exercises.id AS exerciseId,
                exercises.name AS exerciseName,
                exercises.imageUrl AS exerciseImageUrl,
                exercises.machine AS exerciseMachine
            FROM exercises
            LEFT JOIN planExercises
            ON plan.id = planExercises.planId
            LEFT JOIN exercises
            ON planExercises.exerciseId = exercises.id
            WHERE plan.${property} = "${value}";`;

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

            setupDelete: `DELETE FROM planExercises WHERE planId = ${mysql.escape(options.id)} AND NOT id IN (${options.exercises.map(ex => mysql.escape(ex.id)).join(', ')} );`,

            exercises: (planId, exerciseId, position, uId) => `INSERT INTO planExercises (
                        planId,
                        exerciseId,
                        position
                        ${uId ? ', id' : ''}
                    ) VALUES
                    (
                        ${mysql.escape(planId)},
                        ${mysql.escape(exerciseId)},
                        ${mysql.escape(position)}
                        ${uId ? ', ' + mysql.escape(uId) : ''}
                    )
                    ON DUPLICATE KEY UPDATE
                        \`planId\`=VALUES(\`planId\`),
                        \`exerciseId\`=VALUES(\`exerciseId\`),
                        \`position\`=VALUES(\`position\`);`,

            getId: `SELECT id FROM plans WHERE name = ${mysql.escape(options.name)};`
        };

        return getConnection()
        .then (myDb => {
            return new Promise((resolve,reject) => {
                myDb.query(queries.plan, (err, result) => {
                    if (err) {
                        log(2, 'Failed creating the plan', err, queries.plan);
                        reject({status: 500, message: 'Error inputing basic plan data'});
                    } else {
                        resolve();
                    }
                });
            })
            .then(() => {
                if (options.id !== undefined) {
                    log(6, 'Plan updated, deleting removed exercises');
                    return new Promise((resolve, reject) => myDb.query(queries.setupDelete, (err, result) => {
                        if (err) {
                            log(2, 'Failed emptying setup table', err, queries.setupDelete);
                            reject({status: 500, message: 'Error emptying setup table'});
                        }
                        resolve(options.id);
                    }));
                } else {
                    log(6, 'Plan created, getting Id');
                    return new Promise((resolve, reject) => myDb.query(queries.getId, (err, result) => {
                        if (err) {
                            log(2, 'Failed getting exercise id', err, queries.getId);
                            reject({status: 500, message: 'Error getting exercise id after creation'});
                        }
                        resolve(result[0].id);
                    }));
                }
            })
            .then(id => {
                let setting,
                    promises;

                log(6, 'Got Id, inserting exercise list');

                promises = options.exercises.map((exercise, index) => new Promise((resolve, reject) => {
                    myDb.query(queries.exercises(id, exercise.id, (index * 10), exercise.planExerciseId), (err, result) => {
                        if (err) {
                            log(2, 'Failed inserting setup settings', err, queries.setup(id, setting, options.setup[setting]));
                            reject({status: 500, message: 'Error inserting setup settings'});
                        } else {
                            resolve();
                        }
                    });
                }));

                return Promise.all(promises);
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

    getAllPlans: () => {
        const query = `
            SELECT
                plan.id,
                plan.name,
                plan.imageUrl,
                plan.note,
                planExercises.id AS planExerciseId,
                planExercises.position AS exercisePosition,
                exercises.id AS exerciseId,
                exercises.name AS exerciseName,
                exercises.imageUrl AS exerciseImageUrl,
                exercises.machine AS exerciseMachine
            FROM exercises
            LEFT JOIN planExercises
            ON plan.id = planExercises.planId
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