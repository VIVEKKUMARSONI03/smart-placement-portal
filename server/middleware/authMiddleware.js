import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    // ==============================
    // Check Authorization Header
    // ==============================

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Access Denied. No Token Provided",
      });
    }

    // ==============================
    // Extract Token
    // ==============================

    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : authHeader;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access Denied. No Token Provided",
      });
    }

    // ==============================
    // Verify JWT
    // ==============================

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // ==============================
    // Normalize Student ID
    // ==============================

    const studentId =
      decoded._id || decoded.id || decoded.userId;

    if (!studentId) {
      return res.status(401).json({
        success: false,
        message: "Invalid Token: Student ID missing",
      });
    }

    // Keep complete decoded payload
    // and make _id available everywhere
    req.student = {
      ...decoded,
      _id: studentId,
    };

    next();
  } catch (error) {
    console.error(
      "Student Auth Middleware Error:",
      error.message
    );

    return res.status(401).json({
      success: false,
      message: "Invalid or Expired Token",
    });
  }
};

export default authMiddleware;