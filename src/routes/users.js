const router = require('express').Router();
const { auth } = require('../middleware/auth');
const usersController = require('../controllers/users');
const validate = require('../middleware/validate');
const { registerValidation, updateUserValidation } = require('../validations/users');

// router.post('/login', usersController.login);
router.post('/', validate(registerValidation), usersController.register);
router.get('/user', auth, usersController.getCurrentUser);
router.put('/user', auth, validate(updateUserValidation), usersController.updateUser);
router.post('/login', usersController.login);


module.exports = router; 

1 token valid trong 6 thang
// thu2 anh login => 1 token => logout => save token to blacklist
// thu3 ...
... 100

// cach khac 
100 lan login, save 100 token => logout
=> datbase bu len


thu2 login aaaaa => save to db

thu3 login bbbbb => 

thu4 login aaaaa => 

    hacker aaaaa

=> database phinh to



{
    id: user.userId,
    username: user.username,
    email: user.email
  },
  process.env.JWT_SECRET,
  { expiresIn: '7d' }

=> token bang 3 yeu
=> {
    id: user.userId,
    username: user.username,
    email: user.email,
    creat_at: now()
  } => A

  {
    id: user.userId,
    username: user.username,
    email: user.email,
    creat_at: now()
  } => B

  {
    id: user.userId,
    username: user.username,
    email: user.email,
    creat_at: now()
  } => C


  {
    id: user.userId,
    username: user.username,
    email: user.email,
    creat_at: now()
  }
  => save token tu xua



  login => save token 
  validate token => query db/redis => approved
  logout => xoa token khoi db

  o tuong lai: generate new token trung voi token cu~

  hacker cos token => k sai duocj he thong