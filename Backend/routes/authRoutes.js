const router = require("express").Router();
const { register, login, googleLogin, me } = require("../controllers/authController");
const auth = require("../middleware/auth");

router.post("/register", register);
router.post("/login", login);
router.post("/google", googleLogin);
router.get("/me", auth, me);

module.exports = router;
