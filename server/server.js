import path from "path";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import dns from "dns";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";

import connectDB, {
  isDbConnected,
} from "./config/db.js";

import studentRoutes from "./routes/studentRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";

import adminRoutes from "./routes/adminRoutes.js";
import adminStudentRoutes from "./routes/adminStudentRoutes.js";
import adminCompanyRoutes from "./routes/adminCompanyRoutes.js";
import adminJobRoutes from "./routes/adminJobRoutes.js";
import adminApplicationRoutes from "./routes/adminApplicationRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";

import searchRoutes from "./routes/searchRoutes.js";

import aiRoutes from "./routes/aiRoutes.js";
import aiJobRoutes from "./routes/aiJobRoutes.js";

import notificationRoutes from "./routes/notificationRoutes.js";

// =====================================
// Environment
// =====================================

dotenv.config();

const NODE_ENV =
  process.env.NODE_ENV || "development";

const PORT =
  Number(process.env.PORT) || 5000;

const HOST = "0.0.0.0";

// =====================================
// Validate Required Environment Variables
// =====================================

const requiredEnvironmentVariables = [
  "MONGO_URI",
  "JWT_SECRET",
];

const missingEnvironmentVariables =
  requiredEnvironmentVariables.filter(
    (key) => !process.env[key]
  );

if (
  missingEnvironmentVariables.length > 0
) {
  console.error(
    `❌ Missing required environment variables: ${missingEnvironmentVariables.join(
      ", "
    )}`
  );

  process.exit(1);
}

// =====================================
// DNS
// =====================================

dns.setServers([
  "1.1.1.1",
  "8.8.8.8",
]);

// =====================================
// Express App
// =====================================

const app = express();

// =====================================
// Trust Proxy
// Needed for deployment platforms
// =====================================

if (NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

// =====================================
// Security Headers
// =====================================

app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },
  })
);

// =====================================
// Allowed Frontend Origins
// =====================================

const allowedOrigins = (
  process.env.CLIENT_URL ||
  "http://localhost:5173"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

// =====================================
// CORS
// =====================================

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without Origin
      // Example: Postman / server-to-server
      if (!origin) {
        return callback(null, true);
      }

      if (
        allowedOrigins.includes(origin)
      ) {
        return callback(null, true);
      }

      console.warn(
        `Blocked by CORS: ${origin}`
      );

      return callback(
        new Error(
          "Not allowed by CORS"
        )
      );
    },

    credentials: true,

    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);

// =====================================
// Body Parsers
// =====================================

app.use(
  express.json({
    limit: "1mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "1mb",
  })
);

// =====================================
// General API Rate Limiter
// =====================================

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  limit: 500,

  standardHeaders: "draft-8",

  legacyHeaders: false,

  message: {
    success: false,
    message:
      "Too many requests. Please try again later.",
  },
});

app.use("/api", apiLimiter);

// =====================================
// Authentication Rate Limiter
// =====================================

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  limit: 30,

  standardHeaders: "draft-8",

  legacyHeaders: false,

  message: {
    success: false,
    message:
      "Too many login attempts. Please try again later.",
  },
});

// =====================================
// Authentication Route Protection
// =====================================

app.use(
  "/api/students/login",
  authLimiter
);

app.use(
  "/api/students/register",
  authLimiter
);

app.use(
  "/api/company/login",
  authLimiter
);

app.use(
  "/api/company/register",
  authLimiter
);

app.use(
  "/api/admin/login",
  authLimiter
);

// =====================================
// Database Connection
// =====================================

connectDB();

// =====================================
// Database Availability Middleware
// =====================================

app.use(
  "/api",
  (req, res, next) => {
    if (!isDbConnected()) {
      return res.status(503).json({
        success: false,
        message:
          "Service unavailable: database is not connected yet.",
      });
    }

    next();
  }
);

// =====================================
// Static Uploads
// =====================================

app.use(
  "/uploads",
  express.static(
    path.join(
      process.cwd(),
      "uploads"
    ),
    {
      maxAge:
        NODE_ENV === "production"
          ? "1d"
          : 0,
    }
  )
);

// =====================================
// Health / Test Route
// =====================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message:
      "Smart Placement Portal API is Running 🚀",
    environment: NODE_ENV,
  });
});

// =====================================
// Student Routes
// =====================================

app.use(
  "/api/students",
  studentRoutes
);

// =====================================
// Company Routes
// =====================================

app.use(
  "/api/company",
  companyRoutes
);

// =====================================
// Job Routes
// =====================================

app.use(
  "/api/jobs",
  jobRoutes
);

// =====================================
// Application Routes
// =====================================

app.use(
  "/api/applications",
  applicationRoutes
);

// =====================================
// Resume Routes
// =====================================

app.use(
  "/api/resume",
  resumeRoutes
);

// =====================================
// Admin Routes
// =====================================

app.use(
  "/api/admin",
  adminRoutes
);

app.use(
  "/api/admin/students",
  adminStudentRoutes
);

app.use(
  "/api/admin/company",
  adminCompanyRoutes
);

app.use(
  "/api/admin/jobs",
  adminJobRoutes
);

app.use(
  "/api/admin/applications",
  adminApplicationRoutes
);

// =====================================
// Analytics Routes
// =====================================

app.use(
  "/api/analytics",
  analyticsRoutes
);

// =====================================
// Search Routes
// =====================================

app.use(
  "/api/search",
  searchRoutes
);

// =====================================
// AI Routes
// =====================================

app.use(
  "/api/ai",
  aiRoutes
);

app.use(
  "/api/ai/jobs",
  aiJobRoutes
);

// =====================================
// Notification Routes
// =====================================

app.use(
  "/api/notifications",
  notificationRoutes
);

// =====================================
// 404 Route
// =====================================

app.use((req, res) => {
  return res.status(404).json({
    success: false,
    message: "API route not found",
  });
});

// =====================================
// Global Error Handler
// =====================================

app.use(
  (err, req, res, next) => {
    console.error(
      "Server Error:",
      err
    );

    // CORS Error
    if (
      err.message ===
      "Not allowed by CORS"
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Request origin is not allowed",
      });
    }

    const statusCode =
      err.status ||
      err.statusCode ||
      500;

    const message =
      NODE_ENV === "production" &&
      statusCode === 500
        ? "Internal Server Error"
        : err.message ||
          "Internal Server Error";

    return res.status(
      statusCode
    ).json({
      success: false,
      message,

      ...(NODE_ENV !==
        "production" && {
        stack: err.stack,
      }),
    });
  }
);

// =====================================
// Start Server
// =====================================

app.listen(
  PORT,
  HOST,
  () => {
    console.log(
      `✅ Server running on http://localhost:${PORT}`
    );

    console.log(
      `✅ Server listening on ${HOST}:${PORT}`
    );

    console.log(
      `✅ Environment: ${NODE_ENV}`
    );

    console.log(
      `✅ Allowed client: ${allowedOrigins.join(
        ", "
      )}`
    );
  }
);