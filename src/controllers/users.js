const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/jwt');

const prisma = new PrismaClient();

const userResponse = (user, token) => ({
    user: {
      email: user.email,
      token: token || generateToken(user),
      username: user.username,
      bio: user.bio || '',
      image: user.image || ''
    }
  });

const register = async (req, res) => {
    try {
      const { username, email, password } = req.body.user;
      
      const existedEmailUser = await prisma.user.findUnique({ where: { email } });
      
      if (existedEmailUser) {
        return res.status(422).json({
          errors: { body: ['Email already exists'] }
        });
      }

      const existedUsernameUser = await prisma.user.findUnique({ where: { username } });
      if (existedUsernameUser) {
        return res.status(422).json({
          errors: { body: ['Username already exists'] }
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: {
          username,
          email,
          password: hashedPassword
        }
      });
  
      res.status(201).json(userResponse(user));
    } catch (error) {
        console.log(error);
      res.status(422).json({
        errors: { body: ['Could not create user'] }
      });
    }
  };

  const getCurrentUser = async (req, res) => {
    res.json(userResponse(req.user));
  };

  module.exports = {
    register,
    getCurrentUser
  };