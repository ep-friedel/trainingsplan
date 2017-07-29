const   getConnection   = require(process.env.TRAINER_HOME + 'modules/db')
    ,   mysql           = require('mysql')
    ,   log             = require(process.env.TRAINER_HOME + 'modules/log');

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
        });
    },

    createExercise: (options) => {
        const queries = {
            exercises: `INSERT INTO exercises (
                            name,
                            imageUrl,
                            note,
                            machine
                        ) VALUES
                        (
                            ${mysql.escape(options.name)},
                            ${mysql.escape(options.imageUrl)},
                            ${mysql.escape(options.note)},
                            ${mysql.escape(options.machine)}
                        )
                        ON DUPLICATE KEY UPDATE \`name\` = \`name\`;`,
            setup: (id, setting, type) => `INSERT INTO exerciseSetup (
                        exerciseId,
                        setting,
                        type
                    ) VALUES
                    (
                        ${mysql.escape(id)},
                        ${mysql.escape(setting)},
                        ${mysql.escape(type)}
                    )
                    ON DUPLICATE KEY UPDATE \`setting\`=VALUES(\`setting\`), \`type\`=VALUES(\`type\`);`,
            getId: `SELECT id FROM exercises WHERE name = ${mysql.escape(options.name)};`
        };

        return getConnection()
        .then (myDb => {
            return new Promise((resolve,reject) => {
                myDb.query(queries.exercises, (err, result) => {
                    if (err) {
                        log(2, 'Failed creating the exercise', err, queries.exercises);
                        reject({status: 500, message: 'Error inputing basic exercise data'});
                    } else {
                        resolve();
                    }
                });
            })
            .then(() => {
                log(6, 'Exercise created, getting Id');
                return new Promise((resolve, reject) => myDb.query(queries.getId, (err, result) => {
                    if (err) {
                        log(2, 'Failed getting exercise id', err, queries.getId);
                        reject({status: 500, message: 'Error getting exercise id after creation'});
                    }
                    resolve(result[0].id);
                }));
            })
            .then(id => {
                let setting,
                    promises = [];

                log(6, 'Got Id, inserting setup settings');
                for (setting in options.setup) {
                    promises.push(new Promise((resolve, reject) => {
                        myDb.query(queries.setup(id, setting, options.setup[setting]), (err, result) => {
                            if (err) {
                                log(2, 'Failed inserting setup settings', err, queries.setup(id, setting, options.setup[setting]));
                                reject({status: 500, message: 'Error inserting setup settings'});
                            } else {
                                resolve();
                            }
                        });
                    }))
                }

                return Promise.all(promises);
            })
            .then(() => {
                myDb.release();
                return {success: true};
            })
        })
        .catch(err => {
            if (err && err.status) {
                err.success = false;
                return err;
            }

            return error.db.codeError('modules/db/exercise.js:createExercise', arguments);
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
        });
    }
}