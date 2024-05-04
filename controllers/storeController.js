const storeModel = require("../models/StoreModel");
const userModel = require("../models/userModel");
const { sortStoresByDistance } = require("../utils/loc");

exports.getAllStores = async (req, res, next) => {
  const allStores = await storeModel.find();
  res.status(200).json({ length: allStores.length, stores: allStores });
};

exports.createStore = async (req, res, next) => {
  const { name, location } = req.body;
  // console.log(name);

  const store = await storeModel.create({ name, location });

  res.status(201).json({ store });
};

exports.getFavStores = async (req, res, next) => {
  try {
    // Get the favorite store IDs for a specific user
    const favStoreIds = req.user.favStores;
    // console.log(favStoreIds);

    // Find stores where the storeId is in the favStoreIds array
    const stores = await storeModel
      .find({ _id: { $in: favStoreIds } })
      .select("name");

    res.status(200).json({ favStores: stores });
  } catch (error) {
    // Handle error
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.addFavStore = async (req, res, next) => {
  // Get the storeId from the request body
  const { storeId } = req.body;
  const user = req.user;

  const store = await storeModel.find({ _id: storeId });
  console.log(store, req.user.favStores);
  if (!store) {
    return res.status(404).json({ message: "There is no store with this id" });
  }

  // Check if the storeId already exists in the favStores array
  if (user.favStores.includes(storeId.toString())) {
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
};

exports.getSpecificStore = async (req, res, next) => {
  const { storeId } = req.params;
  const store = await storeModel.find({ _id: storeId });

  if (!store) {
    res.status(404).json({ message: "Store not found" });
  }

  res.status(200).json({ store: store });
};

exports.getClosestStore = async (req, res, next) => {
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
};

/*

latitude: 30
longitude: 31.29

 */
