const { Readable } = require("stream");
const cloudinary = require("../config/cloudinary");

const bufferToStream = (buffer) => {
  const readable = new Readable();
  readable._read = () => {};
  readable.push(buffer);
  readable.push(null);
  return readable;
};

const uploadBufferToCloudinary = (buffer, folder = "ecommerce-products") => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
      },
      (error, result) => {
        if (error) return reject(error);

        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      }
    );

    bufferToStream(buffer).pipe(uploadStream);
  });
};

const uploadMultipleImages = async (files, folder = "ecommerce-products") => {
  if (!files || files.length === 0) return [];

  const uploadedImages = [];

  for (const file of files) {
    const uploaded = await uploadBufferToCloudinary(file.buffer, folder);
    uploadedImages.push(uploaded);
  }

  return uploadedImages;
};

module.exports = {
  uploadBufferToCloudinary,
  uploadMultipleImages,
};