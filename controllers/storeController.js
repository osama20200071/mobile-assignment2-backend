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
      $addToSet: { favStores: storeId },
    },
    { new: true }
  );

  res.status(200).json({ user: updateUser });
});

exports.removeFavStore = asyncHandler(async (req, res, next) => {
  // Get the storeId from the request body
  const { storeId } = req.body;
  const store = await storeModel.findById(storeId);

  if (!store) {
    return next(new ApiError("There is no store with this id", 404));
  }

  const user = req.user;

  if (!user.favStores.includes(storeId)) {
    // If the storeId doesn't exist in the favStores array
    return res
      .status(400)
      .json({ message: "Store is not in your favorites already." });
  }

  // If the storeId exists, update the user entity to remove it from favStores
  const updateUser = await userModel.findByIdAndUpdate(
    user._id,
    {
      $pull: { favStores: storeId }, // Remove storeId from favStores array
    },
    { new: true }
  );

  res.status(200).json({ user: updateUser });
});

exports.getFavStores = asyncHandler(async (req, res, next) => {
  const { lat, lon } = req.query;
  console.log(lat, lon);
  const favStoreIds = req.user.favStores;
  const stores = await storeModel
    .find({ _id: { $in: favStoreIds } })
    .select("name location");

  const sortedStores = sortStoresByDistance(stores, +lat, +lon);

  res.status(200).json({ favStores: sortedStores });
});

// else {
// return next(new ApiError("document not updated", 500));
// }
