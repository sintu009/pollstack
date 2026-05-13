const router = require("express").Router();
const { register, login, googleLogin, me, forgotPassword, resetPassword } = require("../controllers/authController");
const auth = require("../middleware/auth");

router.post("/register", register);
router.post("/login", login);
router.post("/google", googleLogin);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/me", auth, me);

module.exports = router;
