#!/usr/bin/env node

const   mysql = require('mysql');

let myDb;

function initDb() {
    let db = mysql.createConnection({
          host     : process.env.EVENT_KEYSTORE_DB_HOST,
          port     : process.env.EVENT_KEYSTORE_DB_PORT,
          user     : process.env.ADMIN_DB_USERNAME,
          password : process.env.ADMIN_DB_PASSWORD
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

let setup = [
    `CREATE USER IF NOT EXISTS '${process.env.EVENT_KEYSTORE_DB_USERNAME}'@'${process.env.EVENT_KEYSTORE_DB_HOST}' IDENTIFIED BY '${process.env.EVENT_KEYSTORE_DB_PASSWORD}';`,
    `CREATE DATABASE IF NOT EXISTS ${process.env.EVENT_KEYSTORE_DB_NAME};`,
    `GRANT ALL PRIVILEGES ON ${process.env.EVENT_KEYSTORE_DB_NAME}.* TO '${process.env.EVENT_KEYSTORE_DB_USERNAME}'@'${process.env.EVENT_KEYSTORE_DB_HOST}';`,
    `USE ${process.env.EVENT_KEYSTORE_DB_NAME};`,
    `CREATE TABLE IF NOT EXISTS \`STORE\` ( \`KEY\` varchar(150) NOT NULL, \`USER\` varchar(150) NOT NULL, \`PKEY\` TEXT NOT NULL, UNIQUE KEY \`USER\` (\`USER\`) );`
];

console.log('Starting Setup.');

function setupDB() {
    myDb.query(setup[0], (err) => {
        if (err) {
            console.log(err);
            process.exit(1);
        } else {
            setup = setup.slice(1);
            if (setup.length) {
                setupDB();
            } else {
                console.log('Completed sucessfully.')
                process.exit();
            }
        }

    });
}
setupDB();