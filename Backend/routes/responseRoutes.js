const router = require("express").Router();
const { submitResponse, getAnalytics, getPublicResults, checkStatus, broadcastProgress } = require("../controllers/responseController");
const auth = require("../middleware/auth");
const optionalAuth = require("../middleware/optionalAuth");

router.post("/", optionalAuth, submitResponse);
router.post("/progress", optionalAuth, broadcastProgress);
router.get("/check/:pollId", optionalAuth, checkStatus);
router.get("/analytics/:pollId", auth, getAnalytics);
router.get("/results/:link", getPublicResults);

module.exports = router;
