// Dummy offer controller (you can extend with schema)
exports.getOffers = async (req, res) => {
  res.json([{ id: 1, title: "Summer Sale", discount: "20%" }]);
};

exports.addOffer = async (req, res) => {
  res.json({ msg: "Offer added", data: req.body });
};

exports.updateOffer = async (req, res) => {
  res.json({ msg: "Offer updated", id: req.params.id, data: req.body });
};

exports.deleteOffer = async (req, res) => {
  res.json({ msg: "Offer deleted", id: req.params.id });
};
