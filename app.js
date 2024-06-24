const express = require("express");
const app = express();
const routes = require("./routes");
const cors = require("cors");

app.use(
  cors({
    origin: "https://apipta.makassarkota.com",
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
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
