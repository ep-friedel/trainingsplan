const	log		= require(process.env.TRAINER_HOME + 'modules/log');


module.exports = {
	default: log,

	router: {
		internalError: (res) => {
			return (err) => {
				log(2, 'Internal Error: ', err);
				log(10, 'Internal Error: ', res);

				res.status(500).send({success: false, error: 'Internal_Error'})
			}
		},

		validate: (options) => {
			return (req, res, next) => {
				let param,
					valid = true,
					payload = {};

				for (param in options) {
					log(6, `Validating ${param}: '${req.body[param]}' against RegExp ${options[param]}, result ${options[param].test(req.body[param])}`);
					if (valid && !options[param].test(req.body[param])) {
						valid = false;
					}
				}

				if (valid) {
					next();
				} else {
					log(4, 'Invalid Request.', req.body);
					res.status(400).send();
				}
			}
		}
	}
};