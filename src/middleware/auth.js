const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const redis_client = require("../config/redis")

const prisma = new PrismaClient();

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Token ')) {
      return res.status(401).json({
        errors: {
          body: ['Authorization token required']
        }
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const storedToken = await redis_client.get(decoded.id.toString());

    if (!storedToken | storedToken !== token) {
      return res.status(401).json({ errors: { body: ["Invalid or expired token"] } });
    }

    const user = await prisma.user.findUnique({
      where: { userId: decoded.id }
    });

    if (!user) {
      throw new Error();
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      errors: {
        body: ['Invalid token']
      }
    });
  }
};

const optional = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Token ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const storedToken = await redis_client.get(decoded.id.toString());
      
      if (storedToken === token) {
        req.user = await prisma.user.findUnique({ where: { userId: decoded.id } });
      }
    }
    next(); // proceed whether authenticated or not
  } catch (error) {
    next();
  }
};

module.exports = { auth, optional }; 