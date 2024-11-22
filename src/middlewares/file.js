const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { cloudinary } = require("../config/cldry");

const multerStorage = (folderName) => {
  return new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: folderName,
      allowedFormats: ["jpg", "png", "jpeg", "gif", "webp"],
      transformation: [{ width: 200, height: 200, crop: "fill" }],
    },
  });
};

const upload = (folderName) => multer({
  storage: multerStorage(folderName),
  limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = { upload };
