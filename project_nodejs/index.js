require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const corse = require('cors');
const httpStatusText = require('./utils/httpStatusText');
const path = require('path');

// use express-validator to check and make validations of request
// const {body} = require('express-validator');

//to show static files like photos in uploads using api /uploads/1729090959139-3.jpg
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// تستخدم علشن الداتا اللى جاية فى باستخدام البوست تجى على شكل jsonعلشان اعرف اخزنها
app.use(express.json()); // or
// app.use(bodyparser.json());


//connect to mongodb
const url = process.env.MONGO_URL;
mongoose.connect(url)
  .then(() => {
    console.log('Connected successfully to MongoDB using Mongoose');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

//معين يكلم الباك وهكذاurlمعين او مثلا لو عايز احدد aptبل اى ريكوست بستخدمها علشان يقدر يكلم الباك وبحدد فيها اى حاجة انا عايزيها يعنى ممكن اخليها تشتغل على 
app.use(corse());

const coursesRouter = require('./routes/courses.route');
const usersRouter = require('./routes/users.route');
//بستخدمها علشان اى حاجة جاية ابعتها على الروتس  middelware ده اسمه 
app.use('/', coursesRouter); //localhost / ==> /api/courses
app.use('/', usersRouter);  //localhost / ==> /api/users

//بستخدم دى علشان لو اليوزر كتب ريكوست مش مهندله او مش موجود اظهر ليه الرسالة دى
//global midderware for not found routes
app.all('*', (req, res) => {
  return res.status(404).json({status: httpStatusText.ERROR, data: {message: "this resource not found"}});
});


//use midderware asyncWarpper
//global error handler
app.use((error, req, res, next) => {
  res.status(error.statusCode || 500).json({status: error.statusText || httpStatusText.ERROR, message: error.message, code: error.statusCode || 500, data: null});
})
app.listen(process.env.PORT || 5000, (err, data)=> {
  console.log("listening on port 5000");
})



