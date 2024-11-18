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
      format: "webp"
    },
  });
};

const upload = (folderName) => multer({
  storage: multerStorage(folderName)
});

module.exports = { upload };
