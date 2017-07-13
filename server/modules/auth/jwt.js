function auth() {
    const   userDB  = require(process.env.CRAWLER_HOME + 'modules/sql/userDB')(back),
            uuid    = require('uuid'),
            jwt     = require('jsonwebtoken');
            log     = require(process.env.EVENT_HOME + 'modules/log');

    const   secretKey = uuid.v4()
        ,   jwtOptions = {
                issuer: 'trainer.fochlac.com'
            };

    let userList;

    function getUserList() {
        userDB.getAllUserSettings()
            .then((ULResp) => {
                userList = ULResp;
                Promise.all(userList.map(userDB.getUserStories))
                    .then((SLResp) => {
                        userList.forEach((item, index) => {
                            item.stories = SLResp[index].map(item => item.short);
                        });

                        back.userList = userList.map(user => {
                            let newItem = Object.assign({}, user);
                            newItem.password = '********';
                            return newItem;
                        });
                    }).catch(m.promiseError);
            });
    }

    function createJWT(userObject) {
        return new Promise( (resolve, reject) => {
           log(4, 'Creating JWT for User: ', userObject.user);
            jwt.sign({user: userObject.user, role: userObject.role}, secretKey, jwtOptions, (err, token) => {
                if (err) reject();
                else resolve(token);
            });
        });
    }

    function jwtVerify(request) {
        return new Promise( (resolve, reject) => {
            if (request.headers.jwt === undefined && request.headers.cookie.indexOf('JWT=') === -1) {
                reject('no token provided');
                return;
            }
            let cookie = {},
                token;

            if (request.headers.cookie) {
                request.headers.cookie.split('; ').forEach(str => {
                    cookie[str.split('=')[0]] = str.split('=')[1];
                });
            }
            token = request.headers.jwt || cookie.JWT;

           log(3, 'decoding JWT-Token');
            jwt.verify(token, secretKey, (err, token) => {
                if (err) reject(err);
                else resolve(token);
            });
        });
    }

    function jwtGetUser(token) {
        return new Promise( (resolve, reject) => {
            let userObject = userList.filter((item) => {
                    return item.user === token.user;
                });

            if (userObject.length > 0) {
               log(3, 'got user list');
                resolve(userObject[0]);
            } else {
                reject();
            }
        });
    }

    function promiseErrorAuth(err) {
       promiseError(err);
        res.status(500).send();
    }

    getUserList();


    return {
        login: (req, res) => {
            let user = req.body.user,
                password = req.body.password,
                userObject = userList.filter((item) => {
                return item.user === user;
            });

           log(2, 'Loginrequest for User: ', user);

            if (userObject.length === 1) {
                if (password === userObject[0].password) {
                    createJWT(userObject[0])
                    .then((myJwt) => {
                       log(3, 'Created JWT for User: ', user);
                        res.status(200).set('Set-Cookie', 'JWT='+myJwt).send({"token": myJwt});
                    })
                    .catch(promiseErrorAuth);
                } else {
                   log(3, 'Wrong password for User: ', user);
                    res.status(401).send({message: 'Incorrect user or password.'});
                }
            } else {
               log(3, 'User not found for User: ', user);
                res.status(401).send({message: 'User not found.'});
            }
        },

        signUp: (req, res) => {
            let user = req.body.user,
                password = req.body.password,
                role = req.body.role;

            if (userList.filter((item) => {
                return item.user === user;
            }).length > 0) {
               log(3, 'Username taken: ', user);
                res.status(400).send({message:  'That user is already taken.'});
            } else {
               log(3, 'Creating user object for user: ', user);
                let userObject = {
                  user: user,
                  password: password,
                  role: role
                };

                userDB.createUserTable(user);
                userDB.insertUserSettings(params)
                    .then(getUserList)
                    .then(() => {
                        res.status(200).send(userObject);
                    });

            }
        },

        createToken: (userObject) => {
            return createJWT(userObject);
        },

        isLoggedIn: (req, res, next) => {
            jwtVerify(req)
            .then(jwtGetUser(token))
            .then((userObject) => {
                req.auth = true;
                req.user = userObject;
                next();
            })
            .catch(err => {
                req.auth = false;
                next();
            })
        },

        isRole:(role) => {
            return (req, res, next) => {
                if (req.user.role === role) {
                    next();
                } else {
                    res.status(403).send();
                }
            }
        }
    };
}

module.exports = auth;