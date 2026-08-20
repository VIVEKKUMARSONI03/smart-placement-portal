import multer from "multer";

// =====================================
// Memory Storage
// =====================================

const storage = multer.memoryStorage();

// =====================================
// Image Filter
// =====================================

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only JPG, JPEG, PNG and WEBP images are allowed"
      ),
      false
    );
  }
};

// =====================================
// Profile Image Upload
// =====================================

const uploadProfileImage = multer({
  storage,

  fileFilter,

  limits: {
    fileSize: 3 * 1024 * 1024,
  },
});

export default uploadProfileImage;