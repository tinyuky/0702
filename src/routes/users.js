const router = require('express').Router();
const { auth } = require('../middleware/auth');
const usersController = require('../controllers/users');

// Register
router.post('/', usersController.register);

// Get current user
router.get('/user', auth, usersController.getCurrentUser);

//login
router.post('/login', usersController.login);

// update user
router.put('/update', auth, usersController.updateUser);



module.exports = router; 
