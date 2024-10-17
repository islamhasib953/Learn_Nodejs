const {body} = require('express-validator');

const validationSchema = () => {
  return [
          body('title')
            .notEmpty()
            .withMessage("title is reqiure")
            .isLength({min: 2})
            .withMessage("title is reqiure with length min 2 chars"),
          body('price')
            .notEmpty()
            .withMessage("price is reqiure")
        ]
}

module.exports = {
  validationSchema
}