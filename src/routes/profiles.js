const router = require('express').Router();
const authMiddleware = require('../middleware/auth');
const profilesController = require('../controllers/profiles');

// get profile
router.get("/:username", authMiddleware.optional, profilesController.getProfile);

// follow user
router.post("/:username/follow", authMiddleware.auth, profilesController.followUser);



module.exports = router;