function toRad(value) {
  return (value * Math.PI) / 180;
}

// function calculateDistance(lat1, lng1, lat2, lng2) {
//   const R = 6371;
//   const dLat = toRad(lat2 - lat1);
//   const dLon = toRad(lng2 - lng1);
//   const l1 = toRad(lat1);
//   const l2 = toRad(lat2);

//   const a =
//     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//     Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(l1) * Math.cos(l2);
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   const d = R * c;
//   return d;
// }
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180); // Convert degrees to radians
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers
  return distance;
};

exports.sortStoresByDistance = (stores, lat, lon) => {
  const sortedStores = stores
    .map((store) => ({
      _id: store._id,
      name: store.name,
      distance: +calculateDistance(
        lat,
        lon,
        store.location.lat,
        store.location.lon
      ).toFixed(2),
    }))
    .sort((a, b) => a.distance - b.distance);

  return sortedStores;
};
