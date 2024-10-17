const express = require('express');
const usersController = require('../controllers/users.controller');
const verifyToken = require('../middlewares/virifyToken');

// use  this for upload photo when registering
const multer = require('multer');
const appError = require('../utils/appError');
const diskStorage = multer.diskStorage(
  {
    destination: function (req, file, cb) {
      // console.log('FILE: ', file);
      cb(null, 'uploads');  //cb ==> give error and folder to store photos
    },
    filename: function (req, file, cb) {  // use this because if other user uploads the same photo name this use to don'nt overwrite in same photo name
      const ext = file.mimetype.split('/')[1]; //to get extension of upload photo
      const fileName = `user-${Date.now()}.${ext}` //create new name of photo
      cb(null, fileName);
    },
  }
);
const fileFilter = (req, file, cb) => {  //==> check of type file mush be image
  const imageType = file.mimetype.split('/')[0]; // ==> get type of image
  if(imageType==='image'){
    cb(null,true);
  }else{
    return cb(appError.create('The file must be an image', 400) ,false);
  }
}
const upload = multer({storage: diskStorage,
                        fileFilter: fileFilter,
})

const router = express.Router();

// get all users
// هنا فى الاول علشان يتاكدمنه انه موجود لو موجود هيكمل بعد كدة ولو مش موجود مش هيعمل حاجة وهيقف verifyToken لى حطيت ال 
router.route('/api/users')
            .get(verifyToken, usersController.getAllUsers)

// register
router.route('/api/users/register')
            .post(upload.single('avatar'), usersController.registerUser)  // use this upload.single('avatar')==> for upload in field avatar

// login
router.route('/api/users/login')
            .post(usersController.loginUser)
module.exports = router;