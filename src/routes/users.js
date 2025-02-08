const router = require('express').Router();
const { auth } = require('../middleware/auth');
const usersController = require('../controllers/users');

// router.post('/login', usersController.login);
router.post('/', usersController.register);
router.get('/user', auth, usersController.getCurrentUser);
// router.put('/user', auth, usersController.updateUser);

module.exports = router; 
