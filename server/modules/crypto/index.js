const	nodeRsa 	= require('node-rsa')
	,	fs 			= require('fs')
	,	userDB		= require(process.env.EVENT_HOME + 'modules/db/user')
	,	error 		= require(process.env.EVENT_HOME + 'modules/error')
	,	keystore	= {};

function createAESKey() {
	return new Promise(res => res('testkey'));
}

function loadRsaKeys() {
	return Promise.all([process.env.KEYSTORE + process.env.EVENT_PRIVATE_KEY, process.env.KEYSTORE + process.env.EVENT_PUBLIC_KEY].map(path => {
		return new Promise((resolve,reject) => {
			fs.readFile(path, (err, data) => {
				if (err) {
					error.default(2, 'Failed to read file ' + path + 'due to err ' + err);
					reject(err);
				} else {
					resolve(data);
				}
			});
		});
	}))
	.then(keyArr => {
		let pubkey = new nodeRsa(),
			privkey = new nodeRsa();

		privkey.importKey(keyArr[0], 'pkcs8');
		pubkey.importKey(keyArr[1], 'public');

		return {
			privateKey: privkey,
			publicKey: pubkey,
			publicPem: createJWK(pubkey.exportKey('components-public'))
		}
	})
	.catch(createRsaKeys);
}

function createJWK(key) {
	console.log(new Buffer(key.n.toString('base64'), 'hex').toString());
	let jwk = {
		kty: 'RSA',
		n: base64url(key.n),
		e: base64url(new Buffer(key.e.toString()))
	};
	console.log(jwk);
	return jwk;
}

function base64url(buffer) {
  	return buffer.toString('base64')
		.replace(/\+/g, '-')
		.replace(/\//g, '_')
		.replace(/=/g, '');
}

function createRsaKeys() {
	let key = new nodeRsa(),
		keyArr;

	key.generateKeyPair();
	keyArr = [key.exportKey('pkcs8'), key.exportKey('public')];

	return Promise.all([process.env.KEYSTORE + process.env.EVENT_PRIVATE_KEY, process.env.KEYSTORE + process.env.EVENT_PUBLIC_KEY].map((path, index) => {
		return new Promise((resolve,reject) => {
			fs.writeFile(path, keyArr[index], (err) => {
				if (err) {
					error.default(2, 'Failed to write file ' + path + ' due to err ' + err);
					reject(err);
				} else {
					resolve();
				}
			});
		});
	})).then(() => {
		return {
			privateKey: key,
			publicKey: key,
			publicPem: createJWK(key.exportKey('components-public'))
		}
	})
}

function encryptKeyforUsers(userList) {
	return (AESKey) => {
		return getUserPublicKey(userList)
			.then(encryptStringWithPublicKey)
			.then(userList => {
				let encryptedKeys = userList.reduce((acc, userObject) => {
					return acc[userObject.name] = userObject.encryptedText;
				}, {})
				return [AESKey, {
					encryptedKeys: encryptedKeys
				}];
			});
	}
}

function getUserPublicKey(userList) {
	return userDB.getUserObjectByUsername(userList)
		.then(userObjectList => userObjectList.map(userObject => {
			return {
					name: userObject.name,
					publicKey: userObject.publicKey
				};
		}));
}

function encryptStringWithPublicKey(userList) {
	userList.map(userObject => {
		userObject.encryptedText = "teststring";
		return userObject;
	});

	return new Promise(resolve => resolve(userList));
}

function encryptDataWithAES(data) {
	return (options) => {
		let AESKey = options[0],
			encryptionObject = options[1];

		return encryptStringWithAES(AESKey, data)
			.then((encryptedText) => {
				encryptionObject.encryptedText = encryptedText;
				return encryptionObject;
			});
	}
}

function encryptStringWithAES(key, string) {
	return new Promise(res => res(string + "is encrypted now!"));
}

function crypto() {

	return {
		getPublicKey: () => {
			if (keystore.server && keystore.server.publicPem) {
				return new Promise(resolve => resolve(keystore.server.publicPem));
			} else {
				return loadRsaKeys()
					.then(keys => {
						console.log('test');
						keystore.server = keys;
						return keys.publicPem;
					});
			}
		},

		encode: (options) => {
			return createAESKey()
				.then(encryptKeyforUsers(options.users))
				.then(encryptDataWithAES(options.data))
				.catch(err => {
					throw('Error while encrypting data: ' + ((typeof err !== 'string') ? JSON.stringify(err) : err));
				});
		}

	}
}


module.exports = crypto;