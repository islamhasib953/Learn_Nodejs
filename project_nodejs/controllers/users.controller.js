const asyncWrapper = require('../middlewares/asyncWrapper');
const User = require('../models/user.model');
const httpStatusText = require('../utils/httpStatusText');
const appError = require('../utils/appError');
const bcrypt = require('bcryptjs');
const genrateJWT = require('../utils/genrate.JWT');

//get all Users
const getAllUsers = asyncWrapper(async (req, res) => {
    // console.log(req.headers);
    const query = req.query;
    const limit = query.limit || 10;
    const page = query.page || 1;
    const skip = (page - 1) * limit;
    const users = await User.find({}, {__v:0, password: false}).limit(limit).skip(skip);
    res.json({status: httpStatusText.SUCCESS,
              data: {users:users}});
});

// Register New User
const registerUser = asyncWrapper(async (req, res, next) => {
    const { firstName, lastName, email, password, role } = req.body;
    // console.log("req.file -> ", req.file);
    const oldUser = await User.findOne({email: email});
    if(oldUser){
        const error = appError.create("User already exist", 400, httpStatusText.FAIL);
        return next(error);
    }
    //passwird hasing
    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
      avatar: req.file ? req.file.filename : 'uploads/profile.jpg'  // if user uploaded photo, save it in uploads folder and save path in database. Else, save default profile photo.  // req.file.path ==> path of uploaded photo  // req.file.originalname ==> name of uploaded photo  // req.file.mimetype ==> type of uploaded photo (like jpg, png, etc)  // req.file.size ==> size
    });

    //genrate JWT token
    const token = await genrateJWT({email: newUser.email, id: newUser._id, role: newUser.role});
    newUser.token = token;

    //save new user in database
    await newUser.save()
    res.status(201).json({status: httpStatusText.SUCCESS,
                        data: {user: newUser}});

});

//login New User
const loginUser = asyncWrapper(async (req, res, next) => {
    const {email, password} = req.body;
    if(!email && !password){
        const error = appError.create("Email and Password are required", 400, httpStatusText.FAIL);
        return next(error);
    }

  
    const user = await User.findOne({email: email});
    if(!user){
        const error = appError.create("user not found", 400, httpStatusText.FAIL);
        return next(error);
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if(isPasswordCorrect && user){
        // genrate token
        const token = await genrateJWT({email: user.email, id: user._id, role: user.role});

        res.status(200).json({status: httpStatusText.SUCCESS, data: {token :token}});
    }else{
        const error = appError.create("Email or Password are incorrect", 500, httpStatusText.ERROR);
        return next(error);
    }
  })



module.exports = {
  getAllUsers,
  registerUser,
  loginUser
}
