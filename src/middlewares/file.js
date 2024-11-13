const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { cloudinary } = require("../config/cldry");

const multerStorage = (folderName) => {
  return new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: folderName,
      allowedFormats: ["jpg", "png", "jpeg", "gif", "webp"],
    },
  });
};

const upload = (folderName) => multer({ storage: multerStorage(folderName) });

module.exports = { upload };
