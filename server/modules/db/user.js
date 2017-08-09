const   getConnection   = require(process.env.TRAINER_HOME + 'modules/db')
    ,   mysql           = require('mysql')
    ,   log             = require(process.env.TRAINER_HOME + 'modules/log')
    ,   error           = require(process.env.TRAINER_HOME + 'modules/error');

module.exports = {
    getUserObjectByProperty: (prop, val) => {
        return getConnection()
        .then (myDb => {
            return new Promise((resolve, reject) => myDb.query(`select * from userlist where ${prop} = ${mysql.escape(val)}`, (err, result) => {
                myDb.release();
                if (err) {
                    log(2, 'modules/db/user:getUserObjectByProperty', err);
                    reject({status: 500, message: 'Unable to find user.'});
                } else {
                    resolve(result[0]);
                }
            }));
        });
    },

    createUser: (options) => {
        const query = [
            `INSERT INTO userlist (
                name,
                hash,
                salt,
                role
            ) VALUES (
                ${mysql.escape(options.name)},
                ${mysql.escape(options.hash)},
                ${mysql.escape(options.salt)},
                ${mysql.escape(options.role)}
            )
            ON DUPLICATE KEY UPDATE \`name\` = \`name\`;`
        ];

        return getConnection()
        .then (myDb => {
            return new Promise((resolve, reject) => myDb.query(`select * from userlist where name = ${mysql.escape(options.name)}`, (err, result) => {
                if (err) {
                    log(2, 'modules/db/user:createUser.1', err);
                    reject({status: 500, message: 'Failed checking if user exists'});
                } else {
                    if (result.length) {
                        reject({status: 400, message: 'User already exists.'})
                    } else {
                        resolve();
                    }
                }
            }))
            .then(() => new Promise((resolve,reject) => {
                myDb.query(query, (err, result) => {
                    if (err) {
                        log(2, 'modules/db/user:createUser.2', err, query);
                        reject({status: 500, message: 'Error creating user'});
                    } else {
                        resolve();
                    }
                });
            }))
            .then(() => {
                log(6, 'User created, getting Id');
                return new Promise((resolve, reject) => myDb.query(`select id, name, role from userlist where name = ${mysql.escape(options.name)};`, (err, result) => {
                    myDb.release();
                    if (err) {
                        log(2, 'modules/db/user:createUser.3', err, query);
                        reject({status: 500, message: 'Error getting user id after creation'});
                    }
                    resolve({
                        user: result[0],
                        success: true
                    });
                }));
            })
        })
        .catch(err => {
            if (err && err.status) {
                err.success = false;
                return err;
            }

            return error.db.codeError('modules/db/user.js:createUser.4', arguments);
        });
    },

    getAllUserSettings: () => {
        return getConnection()
        .then (myDb => {
            return new Promise((resolve, reject) => myDb.query(`select * from userlist`, (err, result) => {
                myDb.release();
                if (err) {
                    log(2, 'modules/db/user:getAllUserSettings', err);
                    reject({status: 500, message: 'Unable to get userlist.'});
                } else {
                    resolve(result);
                }
            }));
        });
    }
}