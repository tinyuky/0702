const { body, query } = require('express-validator');

const createArticleValidation = [
    body('article.title')
      .isString()
      .notEmpty()
      .withMessage('Article title is required')
      .isLength({ min: 5 })
      .withMessage('Title must be at least 5 characters long'),
    body('article.content')
      .isString()
      .notEmpty()
      .withMessage('Article description is required'),
  ];

  const listArticlesValidation = [
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be a number between 1 and 100')
      .toInt(),
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a non-negative number')
      .toInt(),
  ]

module.exports = {
  createArticleValidation,
  listArticlesValidation
}