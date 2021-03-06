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
            acc[row.id].setup[row.setting] = row.type;
        } else {
            let newObj = {};

            if (row.setting !== null) {
                newObj[row.setting] = row.type;
            }

            acc[row.id] = {
                id: row.id,
                name: row.name,
                imageUrl: row.imageUrl,
                note: row.note,
                machine: row.machine,
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
    getExerciseByProperty: (property, value) => {
        const query = `
            SELECT
                exercises.id,
                exercises.name,
                exercises.imageUrl,
                exercises.note,
                exercises.machine,
                exerciseSetup.setting,
                exerciseSetup.type
            FROM exercises
            LEFT JOIN exerciseSetup
            ON exercises.id = exerciseSetup.exerciseId
            WHERE exercises.${property} = "${value}";`;

        return getConnection()
        .then (myDb => {
            return new Promise((resolve, reject) => myDb.query(query, (err, result) => {
                myDb.release();
                if (err) {
                    log(2, 'Failed loading the exercise', err, query);
                    reject({status: 500, message: 'Unable to get exercise.'});
                } else {
                    resolve(reduceToExerciseObjectArray(result));
                }
            }));
        })
        .catch(err => {
            myDb.release();
            if (err && err.status) {
                err.success = false;
                return Promise.reject(err);
            }

            return error.db.codeError('modules/db/exercise.js:getExerciseByProperty', err);
        });
    },

    saveExercise: (options) => {
        const queries = {
            exercises: `INSERT INTO exercises (
                            name,
                            imageUrl,
                            note,
                            machine
                            ${options.id ? ', id' : ''}
                        ) VALUES
                        (
                            ${mysql.escape(options.name)},
                            ${mysql.escape(options.imageUrl)},
                            ${mysql.escape(options.note)},
                            ${mysql.escape(options.machine)}
                            ${(options.id !== undefined) ? ', ' + mysql.escape(options.id) : ''}
                        )
                        ON DUPLICATE KEY UPDATE
                        \`name\`=VALUES(\`name\`),
                        \`imageUrl\`=VALUES(\`imageUrl\`),
                        \`note\`=VALUES(\`note\`),
                        \`machine\`=VALUES(\`machine\`);`,

            setupDelete: `DELETE FROM exerciseSetup 
                          WHERE exerciseId = ${mysql.escape(options.id)}
                          ${Object.keys(options.setup).length ? ('AND NOT setting in (' + mysql.escape(Object.keys(options.setup)) + ')') : ''};`,

            setup: (setup, id) => {
                let insertString = Object.keys(setup).map(setupKey => `(
                    ${mysql.escape(id)},
                    ${mysql.escape(setupKey)},
                    ${mysql.escape(setup[setupKey])}
                )`).join(', ');            

                return `INSERT INTO exerciseSetup (
                        exerciseId,
                        setting,
                        type
                    ) VALUES
                    ${insertString}
                    ON DUPLICATE KEY UPDATE \`type\`=VALUES(\`type\`);`
            }
        };

        let myDb;

        return getConnection()
        .then (Db => {
            myDb = Db;

            return new Promise((resolve,reject) => {
                log(6, 'Creating exercise');
                myDb.query(queries.exercises, (err, result) => {
                    if (err) {
                        log(2, 'Failed creating the exercise', err, queries.exercises);
                        reject({status: 500, message: 'Error inputing basic exercise data'});
                    } else {
                        resolve(result);
                    }
                });
            })
        })
        .then((oldResult) => {
            if (options.id !== undefined) {
                log(6, 'Exercise created, deleting unused entries');
                return new Promise((resolve, reject) => myDb.query(queries.setupDelete, (err, result) => {
                    if (err) {
                        log(2, 'Failed deleting unused entries', err, queries.setupDelete);
                        reject({status: 500, message: 'Error deleting unused entries'});
                    }
                    resolve(options.id);
                }));
            } else {
                log(6, 'Exercise created');
                return Promise.resolve(oldResult.insertId);
            }
        })
        .then(id => {
            if (!Object.keys(options.setup).length) {
                return;
            }

            log(6, 'Got Id, inserting setup settings');
            return new Promise((resolve, reject) => {
                myDb.query(queries.setup(options.setup, id), (err, result) => {
                    myDb.release();
                    if (err) {
                        log(2, 'Failed inserting setup settings', err, queries.setup(options.setup));
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
                return Promise.reject(err);
            }

            return error.db.codeError('modules/db/exercise.js:createExercise', err);
        });

    },

    getAllExercises: () => {
        const query = `
            SELECT
                exercises.id,
                exercises.name,
                exercises.imageUrl,
                exercises.note,
                exercises.machine,
                exerciseSetup.setting,
                exerciseSetup.type
            FROM exercises
            LEFT JOIN exerciseSetup
            ON exercises.id = exerciseSetup.exerciseId;`;

        return getConnection()
        .then (myDb => {
            return new Promise((resolve, reject) => myDb.query(query, (err, result) => {
                myDb.release();
                if (err) {
                    log(2, 'Failed loading exercises', err, query);
                    reject({status: 500, message: 'Unable to get exercises.'});
                } else {
                    resolve(reduceToExerciseObjectArray(result));
                }
            }));
        })
        .catch(err => {
            myDb.release();
            if (err && err.status) {
                err.success = false;
                return Promise.reject(err);
            }

            return error.db.codeError('modules/db/exercise.js:getAllExercises', err);
        });
    }
}