const   mysql = require('mysql');

let myDb;

function initDb() {
    let db = mysql.createConnection({
          host     : process.env.EVENT_KEYSTORE_DB_HOST,
          port     : process.env.EVENT_KEYSTORE_DB_PORT,
          user     : process.env.EVENT_KEYSTORE_DB_USERNAME,
          password : process.env.EVENT_KEYSTORE_DB_PASSWORD,
          database : process.env.EVENT_KEYSTORE_DB_NAME
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
    getPkey: (req, res, next) => {
        req.pkey = 'teststring';
        next();
    }
}