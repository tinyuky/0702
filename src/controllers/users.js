const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/jwt');
const redis_client = require("../config/redis");
const prisma = new PrismaClient();


const userResponse = (user, token) => ({
    user: {
      email: user.email,
      token: token || '',
      username: user.username,
      bio: user.bio || '',
      image: user.image || ''
    }
  });

const register = async (req, res) => {
    try {
      const { username, email, password } = req.body;
      console.log(req.body);
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
          password: hashedPassword,
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

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(422).json({ errors: { body: ['Invalid email or password'] } });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(422).json({ errors: { body: ['Invalid email or password'] } });
  }
  const token = generateToken(user);
  await redis_client.set(user.userId.toString(), token, {EX: 100000});
  res.json(userResponse(user));
};

const updateUser = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { username, email, password, bio, image } = req.body.user;
    
    // Prepare data for update
    const updateData = {};
    if (email) updateData.email = email;
    if (username) updateData.username = username;
    if (bio) updateData.bio = bio;
    if (image) updateData.image = image;

    // hash password if provide
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    // Update user in database
    const updatedUser = await prisma.user.update({
      where: { userId },
      data: updateData,
    });
    const token = await redis_client.get(updatedUser.userId.toString());
    res.json(userResponse(updatedUser, token));

  } catch (error) {
    console.log(error);
    res.status(422).json({ errors: { body: ['Could not update user'] } });
  }
};
 

module.exports = {
  register,
  getCurrentUser,
  login,
  updateUser
};