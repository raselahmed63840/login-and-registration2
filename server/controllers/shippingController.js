// Dummy shipping controller (extend with schema)
exports.getShippingZones = async (req, res) => {
  res.json([{ id: 1, zone: "Dhaka", charge: 100 }]);
};

exports.addShippingZone = async (req, res) => {
  res.json({ msg: "Shipping zone added", data: req.body });
};

exports.updateShippingZone = async (req, res) => {
  res.json({ msg: "Shipping zone updated", id: req.params.id, data: req.body });
};

exports.deleteShippingZone = async (req, res) => {
  res.json({ msg: "Shipping zone deleted", id: req.params.id });
};
