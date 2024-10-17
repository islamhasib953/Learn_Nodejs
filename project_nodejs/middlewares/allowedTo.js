const appError = require('../utils/appError');

module.exports = (...roles)=> {
  return (req, res, next) =>{
    if(!roles.includes(req.decodedToken.role)){
      return next(appError.create('This role is not authorized', 401));
    }
    next();
  }
}


// ... ==> mean convert params to array like i send 'user', 'admin' ==> ['user', 'admin]