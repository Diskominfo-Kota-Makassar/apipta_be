const express = require("express");
const router = express.Router();
const rr = require("../controllers/UserController");

//auth
router.post("/register", rr.register);
router.post("/login", rr.login);

// Health check route
router.get("/health", (req, res) => {
  res.status(200).send("Server is healthy!");
});
// router.get("/forms", bTamu.getAllForms);
// router.get("/forms/:id", bTamu.getFormById);
// router.put("/forms/:id", bTamu.updateForm);
// router.delete("/forms/:id", bTamu.deleteForm);

module.exports = router;
