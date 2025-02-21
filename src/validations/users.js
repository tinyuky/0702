const { body } = require('express-validator');

const registerValidation = [
    body('user.email')
      .isEmail()
      .withMessage('Please provide a valid email address'),
    body('user.password')
      .isString()
      .notEmpty()
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
    body('user.username')
      .isString()
      .notEmpty()
      .withMessage('Username is required')
      .isLength({ min: 3 })
      .withMessage('Username must be at least 3 characters long')
  ];

  const updateUserValidation = [
    body('email')
      .optional()
      .isEmail()
      .withMessage('Please provide a valid email address'),
    body('username')
      .optional()
      .isString()
      .isLength({ min: 3 })
      .withMessage('Username must be at least 3 characters long'),
    body('password')
      .optional()
      .isString()
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
    body('bio')
      .optional()
      .isString(),
    body('image')
      .optional()
      .isURL()
      .withMessage('Image must be a valid URL')
  ];

module.exports = { registerValidation, updateUserValidation };