const { Router } = require("express");
const {
  protect,
  login,
  signup,
  getAllUsers,
  profile,
} = require("../controllers/authController");
const {
  signupValidator,
  loginValidator,
} = require("../utils/validators/userValidator");

const router = Router();

router.post("/login", loginValidator, login);
router.post("/signup", signupValidator, signup);

router.use(protect);
router.get("/", getAllUsers);
router.get("/profile", profile);

module.exports = router;
