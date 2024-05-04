const { Router } = require("express");
const {
  protect,
  login,
  signup,
  getAllUsers,
  profile,
} = require("../controllers/authController");

const router = Router();

router.get("/", protect, getAllUsers);
router.post("/login", login);
router.post("/signup", signup);
router.get("/profile", protect, profile);

module.exports = router;
