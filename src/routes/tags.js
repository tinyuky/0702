const router = require("express").Router();
const tagsController = require("../controllers/tags");

router.get("/getTags", tagsController.getTags); // No auth needed

module.exports = router;
