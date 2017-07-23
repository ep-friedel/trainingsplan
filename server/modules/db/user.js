const   mysql           = require('mysql')
    ,   log             = require(process.env.TRAINER_HOME + 'modules/log');

let myDb;

function initDb() {
    let db = mysql.createConnection({
          host     : process.env.TRAINER_DB_HOST,
          port     : process.env.TRAINER_DB_PORT,
          user     : process.env.TRAINER_DB_USERNAME,
          password : process.env.TRAINER_DB_PASSWORD,
          database : process.env.TRAINER_DB_NAME
        });

    db.on('error', (err) => {
        if (err){
            if (err.code !== 'PROTOCOL_CONNECTION_LOST') {
                throw('MySQL-ConnectionError: ' + err);
            } else {
                myDb = initDb();
            }
        }
    });

    db.connect((err) => {
        if (err) {
            throw('MySQL-ConnectionError: ' + err);
        }
    });

    return db;
};

myDb = initDb();

module.exports = {
    getUserObjectByProperty: (prop, val) => {
        return new Promise((resolve, reject) => myDb.query(`select * from userlist where ${prop} = ${mysql.escape(val)}`, (err, result) => {
            if (err) {
                reject({status: 500, message: 'Unable to find user.'});
            } else {
                resolve(result[0]);
            }
        }))
    },

    createUser: (options) => {
        const queries = [
            `CREATE TABLE ${mysql.escapeId('TP_' + options.name)} (
                name        varchar(150)    NOT NULL,
                active      varchar(150)    NOT NULL,
                UNIQUE KEY \`name\` (\`name\`)
            );`,
            `CREATE TABLE ${mysql.escapeId('EX_' + options.name)} (
                id          varchar(150)    NOT NULL,
                plan        varchar(150)    NOT NULL,
                repetitions varchar(10)     NOT NULL,
                note        TEXT,
                minRep      varchar(10)     NOT NULL,
                maxRep      varchar(10)     NOT NULL,
                setupValue1 varchar(10),
                setupValue2 varchar(10),
                setupValue3 varchar(10),
                setupValue4 varchar(10),
                setupValue5 varchar(10),
                setupName1  varchar(50),
                setupName2  varchar(50),
                setupName3  varchar(50),
                setupName4  varchar(50),
                setupName5  varchar(50),
                UNIQUE KEY \`id\` (\`id\`)
                );`,
            `CREATE TABLE ${mysql.escapeId('HIS_' + options.name)} (
                id          varchar(150)    NOT NULL,
                exercise    varchar(150)    NOT NULL,
                repetition  varchar(10)     NOT NULL,
                reps        varchar(10)     NOT NULL,
                weight      varchar(10)     NOT NULL,
                timestamp   varchar(50)     NOT NULL,
                UNIQUE KEY \`id\` (\`id\`)
            );`,
            `INSERT INTO userlist (
                name,
                hash,
                salt,
                role
            ) VALUES
            (
                ${mysql.escape(options.name)},
                ${mysql.escape(options.hash)},
                ${mysql.escape(options.salt)},
                ${mysql.escape(options.role)}
            )
            ON DUPLICATE KEY UPDATE \`name\` = \`name\`;`
        ];

        return new Promise((resolve, reject) => myDb.query(`select * from userlist where name = ${mysql.escape(options.name)}`, (err, result) => {
            if (err) {
                reject({status: 500, message: 'Failed checking if user exists'});
            } else {
                if (result.length) {
                    reject({status: 400, message: 'User already exists.'})
                } else {
                    resolve();
                }
            }
        }))
        .then(() => Promise.all(queries.map(query => {
            return new Promise((resolve,reject) => {
                myDb.query(query, (err, result) => {
                    if (err) {
                        log(2, 'Failed creating a user', err, query);
                        reject({status: 500, message: 'Error creating user'});
                    } else {
                        resolve();
                    }
                });
            })
        })))
        .then(() => {
            log(6, 'User created, getting Id');
            return new Promise((resolve, reject) => myDb.query(`select id, name, role from userlist where name = ${mysql.escape(options.name)};`, (err, result) => {
                if (err) {
                    log(2, 'Failed getting user id', err, query);
                    reject({status: 500, message: 'Error getting user id after creation'});
                }
                resolve({
                    user: result[0],
                    success: true
                });
            }));
        })
        .catch(err => {
            if (err && err.status) {
                err.success = false;
                return err;
            }

            return error.db.codeError('modules/db/user.js:createUser', arguments);
        })
    },

    getAllUserSettings: () => {
        return new Promise((resolve, reject) => myDb.query(`select * from userlist`, (err, result) => {
            if (err) {
                reject({status: 500, message: 'Unable to get userlist.'});
            } else {
                resolve(result);
            }
        }));
    }
}