const	log		= require(process.env.EVENT_HOME + 'modules/log');


module.exports = {
	default: log,

	router: {

		internalError: (res) => {
			return (err) => {
				log(2, 'Internal Error: ', err);
				log(10, 'Internal Error: ', res);

				res.status(500).send({success: false, error: 'Internal_Error'})
			}
		}
	}
};