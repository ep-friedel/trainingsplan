const	image 	    = require('express').Router()
	,	userDB 		= require(process.env.TRAINER_HOME + 'modules/db/user')
    ,   jwt         = require(process.env.TRAINER_HOME + 'modules/auth/jwt')
	,	error 		= require(process.env.TRAINER_HOME + 'modules/error')
    ,   multer      = require('multer')
    ,   storage     = multer.diskStorage({
        destination: process.env.TRAINER_CLIENT + 'images/plan/',
        filename: function (req, file, cb) {
            let splitfile = file.originalname.split('.'),
                ending = splitfile[splitfile.length - 1];

            cb(null, file.fieldname + '-' + Date.now() + '.' + ending);
        }
    })
    ,   uploader    = multer({ storage: storage });


image.post('/', uploader.single('planImage'), (req, res, next) => {
    console.log(req.file);
    res.status(200).json({url: '/images/plan' + req.file.filename});
}, (err, req, res, next) => {
    res.status(500).send();
});

module.exports = image;

