const Category = require("../models/Category");

exports.getCategories = async (req, res) => {
  const categories = await Category.find();
  res.json(categories);
};

exports.addCategory = async (req, res) => {
  const category = new Category(req.body);
  await category.save();
  res.json(category);
};

exports.updateCategory = async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(category);
};

exports.deleteCategory = async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.json({ msg: "Category deleted" });
};
