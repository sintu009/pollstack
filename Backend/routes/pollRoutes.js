const router = require("express").Router();
const { createPoll, getMyPolls, getPollByLink, publishPoll, toggleActive } = require("../controllers/pollController");
const auth = require("../middleware/auth");

router.post("/", auth, createPoll);
router.get("/my", auth, getMyPolls);
router.get("/link/:link", getPollByLink);
router.patch("/:id/publish", auth, publishPoll);
router.patch("/:id/toggle", auth, toggleActive);

module.exports = router;
