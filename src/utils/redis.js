const { createClient } = require('redis');

const redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));
redisClient.on('connect', () => console.log('Redis Client Connected'));

// Connect to Redis
(async () => {
    await redisClient.connect();
})();

// Get token by userId
const getToken = async (userId) => {
    try {
        const token = await redisClient.get(`auth:${userId}`);
        return token;
    } catch (error) {
        console.error('Error getting token:', error);
        return null;
    }
};

// Get all auth tokens
const getAllAuthTokens = async () => {
    try {
        const keys = await redisClient.keys('auth:*');
        const tokens = {};
        for (const key of keys) {
            const userId = key.split(':')[1];
            tokens[userId] = await redisClient.get(key);
        }
        return tokens;
    } catch (error) {
        console.error('Error getting all tokens:', error);
        return {};
    }
};

// Cache middleware
const cacheMiddleware = (duration) => {
    return async (req, res, next) => {
        const key = req.originalUrl;
        try {
            const cachedResponse = await redisClient.get(key);
            if (cachedResponse) {
                return res.json(JSON.parse(cachedResponse));
            }
            res.originalJson = res.json;
            res.json = async (body) => {
                await redisClient.setEx(key, duration, JSON.stringify(body));
                res.originalJson(body);
            };
            next();
        } catch (error) {
            console.error('Redis cache error:', error);
            next();
        }
    };
};

// Clear cache by pattern
const clearCache = async (pattern) => {
    try {
        const keys = await redisClient.keys(pattern);
        if (keys.length > 0) {
            await redisClient.del(keys);
        }
    } catch (error) {
        console.error('Error clearing cache:', error);
    }
};

module.exports = {
    redisClient,
    cacheMiddleware,
    clearCache,
    getToken,
    getAllAuthTokens
}; 