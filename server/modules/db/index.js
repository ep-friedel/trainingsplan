const   mysql           = require('mysql')
    ,   log             = require(process.env.TRAINER_HOME + 'modules/log');

let db = mysql.createPool({
  host     : process.env.TRAINER_DB_HOST,
  port     : process.env.TRAINER_DB_PORT,
  user     : process.env.TRAINER_DB_USERNAME,
  password : process.env.TRAINER_DB_PASSWORD,
  database : process.env.TRAINER_DB_NAME
});

module.exports = () => new Promise((resolve, reject) => {
  db.getConnection((err, connection) => {
    if (err) {
      log(2, 'modules/db/index:1', err);
      reject();
    }
    resolve(connection);
  });
});