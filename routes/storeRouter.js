const { Router } = require("express");
const { protect } = require("../controllers/authController");
const {
  getAllStores,
  getClosestStore,
  addFavStore,
  createStore,
  getSpecificStore,
  getFavStores,
} = require("../controllers/storeController");
const router = Router();

// check if the user is authenticated (logged in)
router.use(protect);
router.get("/fav-stores", getFavStores);

router.post("/", createStore);
router.get("/:storeId", getSpecificStore);
router.get("/", getAllStores);

router.post("/fav-stores", addFavStore);

// to do
router.post("/closest-store", getClosestStore);

module.exports = router;
