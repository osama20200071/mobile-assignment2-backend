const storeModel = require("../models/StoreModel");
const userModel = require("../models/userModel");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("express-async-handler");
const { sortStoresByDistance } = require("../utils/loc");

// =================================================================
// ====================== store curd ops ===========================
// =================================================================

exports.getSpecificStore = asyncHandler(async (req, res, next) => {
  const { storeId } = req.params;
  const store = await storeModel.findById(storeId);
  if (store) {
    res.status(200).json(store);
  } else {
    return next(new ApiError("store not found", 404));
  }
});
exports.deleteSpecificStore = asyncHandler(async (req, res, next) => {
  const { storeId } = req.params;
  const store = await storeModel.findByIdAndDelete(storeId);

  if (store) {
    res.status(200).json({
      msg: "the document deleted successfully",
      deleteDocument: store,
    });
  } else {
    next(new ApiError(`the document is not available with id ${id}`, 404));
  }
});
exports.getAllStores = asyncHandler(async (req, res, next) => {
  const allStores = await storeModel.find();
  res.status(200).json({ results: allStores.length, stores: allStores });
});
exports.createStore = asyncHandler(async (req, res, next) => {
  const { name, location } = req.body;

  const store = await storeModel.findOne({ name: name });
  if (store) {
    console.log(store);
    return res
      .status(400)
      .json({ message: "There is Store already exist with the same name." });
  }

  const newStore = await storeModel.create({ name, location });
  res.status(201).json({ newStore });
});

// =================================================================
// ====================== store other ops ===========================
// =================================================================
exports.getFavStores = asyncHandler(async (req, res, next) => {
  // Get the favorite store IDs for a specific user
  const favStoreIds = req.user.favStores;
  // Find stores where the storeId is in the favStoreIds array
  const stores = await storeModel
    .find({ _id: { $in: favStoreIds } })
    .select("name location");
  res.status(200).json({ favStores: stores });
});

exports.addFavStore = asyncHandler(async (req, res, next) => {
  // Get the storeId from the request body
  const { storeId } = req.body;

  const store = await storeModel.findById(storeId);
  if (!store) {
    return next(new ApiError("There is no store with this id", 404));
  }

  const user = req.user;
  // Check if the storeId already exists in the favStores array
  if (user.favStores.includes(storeId)) {
    // If the storeId already exists
    return res
      .status(400)
      .json({ message: "Store already added to favorites." });
  }

  // If it doesn't exist, update the user entity
  const updateUser = await userModel.findByIdAndUpdate(
    user._id,
    {
      // Add the storeId to the favStores array
      favStores: [...user.favStores, storeId], // $addToSet ensures uniqueness
    },
    { new: true }
  );

  res.status(200).json({ user: updateUser });
});

exports.getClosestStore = asyncHandler(async (req, res, next) => {
  const { userLocation } = req.body;
  console.log(userLocation);
  const allStores = await storeModel.find();

  const sortedStores = sortStoresByDistance(
    allStores,
    userLocation.lat,
    userLocation.lon
  );

  // console.log(sortedStores);
  res.status(200).json({ nearestStore: sortedStores[0] });
});

// else {
// return next(new ApiError("document not updated", 500));
// }
