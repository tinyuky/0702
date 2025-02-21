const router = require('express').Router();
const { auth } = require('../middleware/auth');
const validate = require('../middleware/validate');
const articlesController = require('../controllers/articles');
const { createArticleValidation, listArticlesValidation } = require('../validations/articles');

router.post('/', auth, validate(createArticleValidation), articlesController.createArticle);
router.get('/',  auth, validate(listArticlesValidation), articlesController.getArticles);

module.exports = router; 

