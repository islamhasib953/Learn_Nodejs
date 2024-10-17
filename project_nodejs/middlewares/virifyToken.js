const JWT = require('jsonwebtoken');
const httpStatusText = require('../utils/httpStatusText');
const appError = require('../utils/appError');

// middleware to verify JWT token
const verifyToken = (req, res, next) =>{
    const AutHeader = req.headers['Authorization'] || req.headers['authorization'];
    if(!AutHeader){
        const error = appError.create('Token is required', 401, httpStatusText.ERROR);  // unauthorized access!
        return next(error);
    }
    const token = AutHeader.split(' ')[1];
    try {
        const decodedToken = JWT.verify(token, process.env.TOKEN_SECRET_KEY);
        //علشان استخدمه role انا بعمل كل ده علشان فى النهاية اقدر امسح ال 
        req.decodedToken = decodedToken;  // attach user to request object for further use.  // req.decodedToken = {email: decodedToken.email, id: decodedToken.id, role: decodedToken.role }  // for example.
        // console.log('DecodedToken', decodedToken);
        next();
    }catch(err){
        const error = appError.create(err.message, 401, httpStatusText.ERROR);
        return next(error);
    }

}

module.exports = verifyToken;