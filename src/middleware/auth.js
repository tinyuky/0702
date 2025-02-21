const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const { redisClient } = require('../utils/redis');

const prisma = new PrismaClient();

const auth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const token = authHeader.split(' ')[1];
        
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Check if token exists in Redis
        const redisKey = `auth:${decoded.id}`;
        const storedToken = await redisClient.get(redisKey);
        
        if (!storedToken || storedToken !== token) {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }

        // Get user from database
        const user = await prisma.user.findUnique({
            where: { userId: decoded.id }
        });

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        req.user = user;
        req.token = token;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token' });
        }
        console.error('Auth middleware error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// Middleware to handle logout
const logout = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const redisKey = `auth:${userId}`;
        await redisClient.del(redisKey);
        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Logout error:', error);
        next(error);
    }
};

module.exports = {
    auth,
    logout
}; 