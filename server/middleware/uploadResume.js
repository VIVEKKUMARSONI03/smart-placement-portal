import multer from "multer";

// =====================================
// Memory Storage
// File temporarily RAM me rahegi
// =====================================

const storage = multer.memoryStorage();

// =====================================
// PDF Filter
// =====================================

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(
      new Error("Only PDF files are allowed"),
      false
    );
  }
};

// =====================================
// Resume Upload Middleware
// =====================================

const uploadResume = multer({
  storage,

  fileFilter,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

export default uploadResume;