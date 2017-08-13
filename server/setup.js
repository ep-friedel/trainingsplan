#!/usr/bin/env node

const   mysql = require('mysql');

let myDb;

function initDb() {
    let db = mysql.createConnection({
          host     : process.env.TRAINER_DB_HOST,
          port     : process.env.TRAINER_DB_PORT,
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
    `CREATE USER IF NOT EXISTS '${process.env.TRAINER_DB_USERNAME}'@'${process.env.TRAINER_DB_HOST}' IDENTIFIED BY '${process.env.TRAINER_DB_PASSWORD}';`,
    `DROP DATABASE ${process.env.TRAINER_DB_NAME};`,
    `CREATE DATABASE IF NOT EXISTS ${process.env.TRAINER_DB_NAME};`,
    `GRANT ALL PRIVILEGES ON ${process.env.TRAINER_DB_NAME}.* TO '${process.env.TRAINER_DB_USERNAME}'@'${process.env.TRAINER_DB_HOST}';`,
    `USE ${process.env.TRAINER_DB_NAME};`,

    `CREATE TABLE IF NOT EXISTS \`userlist\` (
        \`id\`      int             NOT NULL    AUTO_INCREMENT,
        \`name\`    varchar(150)    NOT NULL,
        \`hash\`    varchar(150)    NOT NULL,
        \`salt\`    varchar(150)    NOT NULL,
        \`role\`    varchar(150)    NOT NULL,

        PRIMARY KEY (id),
        UNIQUE KEY \`name\` (\`name\`)
    );`,

    `CREATE TABLE IF NOT EXISTS \`exercises\` (
        \`id\`          int             NOT NULL    AUTO_INCREMENT,
        \`name\`        varchar(150)    NOT NULL,
        \`imageUrl\`    TEXT            NOT NULL,
        \`note\`        TEXT            NOT NULL,
        \`machine\`     TEXT            NOT NULL,

        PRIMARY KEY (id),
        UNIQUE KEY \`name\` (\`name\`)
    );`,

    `CREATE TABLE IF NOT EXISTS \`exerciseSetup\` (
        \`id\`          int     NOT NULL    AUTO_INCREMENT,
        \`exerciseId\`  int     NOT NULL,
        \`setting\`     TEXT    NOT NULL,
        \`type\`        TEXT    NOT NULL,

        PRIMARY KEY (id),
        UNIQUE KEY \`setting\` (\`setting\`, \`exerciseId\`)
    );`,

    `CREATE TABLE IF NOT EXISTS \`plans\` (
        \`id\`          int             NOT NULL    AUTO_INCREMENT,
        \`name\`        varchar(150)    NOT NULL,
        \`imageUrl\`    TEXT            NOT NULL,
        \`note\`        TEXT            NOT NULL,

        PRIMARY KEY (id),
        UNIQUE KEY \`name\` (\`name\`)
    );`,

    `CREATE TABLE IF NOT EXISTS \`planExercises\` (
        \`id\`          int     NOT NULL    AUTO_INCREMENT,
        \`planId\`      int     NOT NULL,
        \`position\`    int     NOT NULL,
        \`repetitions\` int     NOT NULL,
        \`note\`        TEXT    NOT NULL,
        \`exerciseId\`  int     NOT NULL,

        PRIMARY KEY (id),
        UNIQUE KEY \`id\` (\`id\`)
    );`,

    `CREATE TABLE IF NOT EXISTS \`userPlanSettings\` (
        id          int             NOT NULL    AUTO_INCREMENT,
        userId      int             NOT NULL,
        userPlanId  int             NOT NULL,
        exerciseId  int             NOT NULL,
        settingId   int             NOT NULL,
        value       varchar(150),

        PRIMARY KEY (id),
        UNIQUE KEY \`userPlanId\` (\`exerciseId\`, \`userPlanId\`, \`setting\`)
    );`,

    `CREATE TABLE IF NOT EXISTS \`userPlans\` (
        id          int             NOT NULL    AUTO_INCREMENT,
        userId      int             NOT NULL,
        planId      int             NOT NULL,
        active      int,
        note        TEXT,

        PRIMARY KEY (id),
        UNIQUE KEY \`id\` (\`id\`)
        );`,

    `CREATE TABLE ${mysql.escapeId('planHistory')} (
        id          int             NOT NULL    AUTO_INCREMENT,
        userid      int             NOT NULL,
        exerciseid  int             NOT NULL,
        repetition  int             NOT NULL,
        reps        int             NOT NULL,
        weight      int             NOT NULL,
        timestamp   varchar(50)     NOT NULL,

        PRIMARY KEY (id),
        UNIQUE KEY \`id\` (\`id\`)
    );`,
];

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

process.stdin.resume();
process.stdin.setEncoding('utf8');

console.log(
`--------------------------------------------------
|           Setup Trainingsplan Server           |
--------------------------------------------------
|                                                |
|      Warnung: Sollten bereits Daten in der     |
|       Datenbank existieren, werden diese       |
|     durch die Installation gelöscht werden     |
|                                                |
--------------------------------------------------
|  Bitte bestätigen Sie den Installationswunsch  |
--------------------------------------------------
(y/n): `.replace(/:\n/, ':'));

process.stdin.on('data', function (text) {
    if (text === 'y\n') {
        setupDB();
    } else if (text === 'n\n') {
        process.exit()
    } else {
        console.log(
`--------------------------------------------------
|  Ungültige Eingabe, bitte bestätigen Sie den   |
|              Installationswunsch               |
--------------------------------------------------
(y/n): `.replace(/:\n/, ':')
        );
    }
});
