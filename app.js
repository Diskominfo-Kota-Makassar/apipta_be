const express = require("express");
const app = express();
const routes = require("./routes");
const cors = require("cors");

app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = [
        "https://apipta.makassarkota.com",
        "http://localhost:3030",
        "http://localhost:8863",
      ];
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Allows cookies to be sent from the front-end
  })
);
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
