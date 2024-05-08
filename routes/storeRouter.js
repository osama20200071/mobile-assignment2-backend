const { Router } = require("express");
const { protect } = require("../controllers/authController");
const {
  getAllStores,
  getClosestStore,
  addFavStore,
  createStore,
  getSpecificStore,
  getFavStores,
  deleteSpecificStore,
} = require("../controllers/storeController");
const {
  getStoreValidator,
  deleteStoreValidator,
  createStoreValidator,
  addFavStoreValidator,
} = require("../utils/validators/storeValidator");
const router = Router();

// check if the user is authenticated (logged in)
router.use(protect);
// here is the order is important as it treats with /fav-stores as it's storeId
router.get("/fav-stores", getFavStores);

// crud operations
router.post("/", createStoreValidator, createStore);
router.get("/:storeId", getStoreValidator, getSpecificStore);
router.delete("/:storeId", deleteStoreValidator, deleteSpecificStore);
router.get("/", getAllStores);
// to do => delete

router.post("/fav-stores", addFavStoreValidator, addFavStore);

// to do
// router.post("/closest-store", getClosestStore);

module.exports = router;
