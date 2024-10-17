// let {courses} = require('../data/courses'); // we use it to use data local in folder data
const {validationResult} = require('express-validator');
const Course = require('../models/course.model');
const httpStatusText = require('../utils/httpStatusText');
const asyncWrapper = require('../middlewares/asyncWrapper');
const appError = require('../utils/appError');

// get All courses From Database Using Course Model
const getAllCourses = asyncWrapper(async(req, res) => {
  const query = req.query;
  const limit = query.limit || 10;
  const page = query.page || 1;
  const skip = (page - 1) * limit;
  const courses = await Course.find({}, {__v:0}).limit(limit).skip(skip);
  res.json({status: httpStatusText.SUCCESS,
            data: {courses:courses}});
})

// get single course
const getSingleCourse = asyncWrapper(
  async (req, res, next) =>{
  const course = await Course.findById(req.params.courseId);
  if (!course){
    const error = appError.create("Course not found", 404, httpStatusText.FAIL);
    return next(error);
    // or
    // return res.status(404).json({status: httpStatusText.FAIL, data: {course: "Course not found"}});
  }
  res.json({status: httpStatusText.SUCCESS,
            data: {course: course}});
  // try {
  //     const course = await Course.findById(req.params.courseId);
  //     if (!course){
  //       return res.status(404).json({status: httpStatusText.FAIL, data: {course: "Course not found"}});
  //     }
  //     res.json({status: httpStatusText.SUCCESS,
  //               data: {course: course}});
  // } catch (error) {
  //   res.status(400).json({status: httpStatusText.ERROR, data: null, message: error.message, code: 400});
  // }
  }
)

// add new course
const addCourse = asyncWrapper(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()){
    const error = appError.create(errors.array(), 400, httpStatusText.FAIL);
    return next(error);
    // return res.status(400).json({status: httpStatusText.FAIL, data: {errors: errors.array()}});
  }

  const newCourse = new Course(req.body);
  await newCourse.save()
  // const newCourse = {id: courses.length + 1, ...req.body}
  // courses.push(newCourse)
  res.status(201).json({status: httpStatusText.SUCCESS,
                        data: {course: newCourse}});
})

// update course
const updateCourse = asyncWrapper(async (req, res, next) => {
  //use it when i used local data from folder data
  // const courseId = +req.params.courseId
  // let course = courses.find((course) => course.id === courseId)
  // course = {...course, ...req.body}

  const CourseID = req.params.courseId
  // uppdate but return found documet not return updated decument
  // const UpdatedCourse = await Course.findByIdAndUpdate(CourseID, {$set: {...req.body}});
  // update and return updated decument
  const UpdatedCourse = await Course.updateOne({_id: CourseID}, {$set: {...req.body}});
  if(!UpdatedCourse){
    const error = appError.create("Course not found", 404, httpStatusText.FAIL);
    return next(error);
      }
  res.status(200).json({status: httpStatusText.SUCCESS,
                          data: {course: UpdatedCourse}});
  // try{
  //     if(!UpdatedCourse){
  //     return res.status(404).json({status: httpStatusText.FAIL, data: {course: "Course not found"}});
  //     }
  //     res.status(200).json({status: httpStatusText.SUCCESS,
  //                           data: {course: UpdatedCourse}});
  // }catch(error){
  //     res.status(400).json({status: httpStatusText.ERROR, data: null, message: error.message, code: 400});
  // }
})

//delete course
const deleteCourse = asyncWrapper(async (req, res) => {
  // const courseId = +req.params.courseId;
  // courses = courses.filter((course) => course.id !== courseId);
  const DeleteCourse = await Course.deleteOne({_id: req.params.courseId});
  res.json({status: httpStatusText.SUCCESS,
            data: null});

})

module.exports = {
  getAllCourses,
  getSingleCourse,
  addCourse,
  updateCourse,
  deleteCourse,
};