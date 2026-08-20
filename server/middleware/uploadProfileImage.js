import multer from "multer";
import path from "path";
import fs from "fs";

// =====================================
// Profile Image Upload Folder
// =====================================

const uploadPath = "uploads/profile-images";

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, {
    recursive: true,
  });
}

// =====================================
// Storage
// =====================================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9);

    cb(
      null,
      uniqueName +
        path.extname(file.originalname)
    );
  },
});

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
// Multer
// =====================================

const uploadProfileImage = multer({
  storage,

  fileFilter,

  limits: {
    fileSize: 3 * 1024 * 1024,
  },
});

export default uploadProfileImage;