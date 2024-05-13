const { Router } = require("express");
const { protect } = require("../controllers/authController");
const {
  getAllStores,
  addFavStore,
  createStore,
  getSpecificStore,
  getFavStores,
  deleteSpecificStore,
  removeFavStore,
} = require("../controllers/storeController");
const {
  getStoreValidator,
  deleteStoreValidator,
  createStoreValidator,
  addFavStoreValidator,
  removeFavStoreValidator,
} = require("../utils/validators/storeValidator");
const router = Router();

// check if the user is authenticated (logged in)
router.use(protect);
// here is the order is important as it treats with /fav-stores as it's storeId
router.get("/fav-stores", getFavStores);
router.post("/fav-stores", addFavStoreValidator, addFavStore);
router.delete("/fav-stores", removeFavStoreValidator, removeFavStore);

// crud operations
router.post("/", createStoreValidator, createStore);
router.get("/:storeId", getStoreValidator, getSpecificStore);
router.delete("/:storeId", deleteStoreValidator, deleteSpecificStore);
router.get("/", getAllStores);

// to do => delete

// to do
// router.post("/closest-stores", getClosestStore);

module.exports = router;
