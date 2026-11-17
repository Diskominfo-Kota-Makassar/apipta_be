const express = require("express");
const app = express();
const routes = require("./routes");
const cors = require("cors");

app.disable("x-powered-by");

// Define the allowed origins
const allowedOrigins = [
  "https://apipta.makassarkota.go.id",
  "https://apipta.makassarkota.com",
  "http://localhost:3030",
  "http://localhost:8863",
];

// CORS options - strictly validate origin to avoid wildcard reflection
const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser requests or allowed browser origins
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Blocked by CORS policy"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Security HTTP headers
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  next();
});

// Body parsers with size limits to mitigate JSON DoS
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));

// Main API routes
app.use("/api", routes);

// Global error handler
app.use((err, req, res, next) => {
  if (err.message === "Blocked by CORS policy") {
    return res.status(403).json({ message: "Origin not allowed by CORS" });
  }
  console.error("Unhandled error:", err);
  return res.status(err.status || 500).json({
    message: err.message || "Internal server error",
  });
});

// Only start the server if not running in test environment
if (process.env.NODE_ENV !== "test") {
  app.listen(3200, () => {
    console.log("Server running on http://localhost:3200");
  });
} else {
  app.listen(3300, () => {
    console.log("Server running prod on http://localhost:3300");
  });
}

module.exports = app; // Export the app for testing purposes
