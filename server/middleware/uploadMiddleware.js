const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = path.join(__dirname, "../uploads/products");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },

  filename: function (req, file, cb) {
    const fileExt = path.extname(file.originalname);
    const fileName =
      Date.now() + "-" + Math.round(Math.random() * 1e9) + fileExt;

    cb(null, fileName);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype && file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

// This accepts images, image, and files field names
exports.uploadProductImages = upload.fields([
  { name: "images", maxCount: 10 },
  { name: "image", maxCount: 10 },
  { name: "files", maxCount: 10 },
]);
