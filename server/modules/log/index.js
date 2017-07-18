const   fs = require('fs');

/**
*   Error Levels:
*   0: no error, very important info
*   1: error: critical error in app
*   2: error: internal error in app
*   3: error: minor error
*
*   4: info: important info (bad request/login)
*   5: info: minor info
*
*   6: trace: tracing informations
*
*  10: full trace: (requests objects, etc)
*
**/

let logStream,
    date,
    timeout,
    getDate = () => {
        if (!timeout) {
            timeout = true;
            setTimeout(() => {
                timeout=false;
            }, 1000);

            date = new Date();
            date = date.getFullYear() + '_' + date.getMonth() + '_' + date.getDate();
        }
        return date;
    },
    currentDate = getDate();

logStream = fs.createWriteStream(process.env.EVENT_HOME + 'log/output' + getDate() + '.txt', {
    flags: 'a',
    defaultEncoding: 'utf8',
    autoClose: true
});

logStream.on('error', (err) => {
    console.log(err);
});


module.exports = (level, ...message) => {
    let logMessage = ' - ' + level + ' - ' + message.map((item) => {
        let output;
        if (typeof item === 'string') {
            output = item;
        } else {
            try {
                output = JSON.stringify(item);
            }
            catch(err) {
                console.log(item);
                output = err;
            }
        }
        return output;
    }).join(' ') + '\n';

    console.log(logMessage);

    if (currentDate !== getDate()) {
        currentDate = getDate();
        logStream.end();
        logStream = fs.createWriteStream(process.env.EVENT_HOME + 'log/output' + getDate() + '.txt', {
            flags: 'a',
            defaultEncoding: 'utf8',
            autoClose: true
        });
    }

    logStream.write(logMessage);
};;