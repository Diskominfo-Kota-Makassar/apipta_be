const express = require("express");
const app = express();
const routes = require("./routes");
const cors = require("cors");

// Define the allowed origins
const allowedOrigins = [
  "https://apipta.makassarkota.com",
  "http://localhost:3030",
  "http://localhost:8863",
];

// CORS options
const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200, // For legacy browser support
};
app.use(cors());
app.use(express.json());
app.use("/api", routes);

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
