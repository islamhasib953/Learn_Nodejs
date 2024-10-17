const express = require('express');

const router = express.Router();
const courseController = require('../controllers/courses.controller');
const { validationSchema } = require('../middlewares/validationschema');
const verifyToken = require('../middlewares/virifyToken');
const allowedTo = require('../middlewares/allowedTo');
const userRoles = require('../utils/userRoles');

//get all courses
// router.get('/api/courses', courseController.getAllCourses);

// create a new course
// router.post('/api/courses',
//             verifyToken,
//             validationSchema(),
//             courseController.addCourse
// )

// make all same api but different method in same route
router.route('/api/courses')
            .get(verifyToken, courseController.getAllCourses)
            .post(
              verifyToken,  // must be authenticated to add a course يعني انه يجب عليه ان يكون موجود فى التابعين الذين هم مش موجودين ولا يكون عليهم التسجيل
              validationSchema(),
              courseController.addCourse);

//get single course using id
// router.get('/api/courses/:courseId', courseController.getSingleCourse)

// update course
// router.patch('/api/courses/:courseId', courseController.updateCourse);

// /Delete Course
// router.delete('/api/courses/:courseId', courseController.deleteCourse);

// make all same api but different method in same route
router.route('/api/courses/:courseId')
            .get(verifyToken, courseController.getSingleCourse)
            .patch(verifyToken, courseController.updateCourse)
            .delete(verifyToken, allowedTo(userRoles.ADMIN, userRoles.MANAGER), courseController.deleteCourse);

module.exports = router;
