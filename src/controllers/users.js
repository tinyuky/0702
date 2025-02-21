const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/jwt');
const { redisClient } = require('../utils/redis');

const prisma = new PrismaClient();

const TOKEN_EXPIRATION = 24 * 60 * 60; // 24 hours in seconds

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

  const updateUser = async (req, res) => {
    try {
      const { email, username, password, image, bio } = req.body.user;
      const updateData = {};
    
      if (email) updateData.email = email;
      if (username) updateData.username = username;
      if (image) updateData.image = image;
      if (bio) updateData.bio = bio;
      if (password) {
        updateData.password = await bcrypt.hash(password, 10);
      }
      
      const user = await prisma.user.update({
        where: { userId: req.user.userId },
        data: updateData
      });
  
      res.json(userResponse(user));
    } catch (error) {
      console.log(error);
      res.status(422).json({
        errors: { body: ['Could not update user'] }
      });
    }
  };

  const getCurrentUser = async (req, res) => {
    res.json(userResponse(req.user));
  };

  const login = async (req, res) => {
    try {
        const { email, password } = req.body.user;

        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = generateToken(user);
        
        // Store token in Redis with user ID as key
        const redisKey = `auth:${user.userId}`;
        await redisClient.setEx(redisKey, TOKEN_EXPIRATION, token);

        return res.json({
            user: {
                email: user.email,
                username: user.username,
                bio: user.bio,
                image: user.image,
                token
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

  module.exports = {
    register,
    getCurrentUser,
    updateUser,
    login
  };