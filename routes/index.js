const express = require("express");
const router = express.Router();
const rr = require("../controllers/UserController");
const rc = require("../controllers/ChatController");
const roleController = require("../controllers/RoleController");

//auth
router.post("/register", rr.register);
router.post("/login", rr.login);
router.get("/user/all", rr.getall);

//chats
router.post("/chats", rc.save);
router.get("/chats/:pengirim", rc.getchat);

//roles
router.post("/roles", roleController.add);
router.get("/roles", roleController.get);
router.get("/roles/user", roleController.getAllRolesWithUsers);
router.put("/roles/:id", roleController.update);
router.delete("/roles/:id", roleController.delete);
// Health check route
router.get("/health", (req, res) => {
  res.status(200).send("Server is healthy!");
});
// router.get("/forms", bTamu.getAllForms);
// router.get("/forms/:id", bTamu.getFormById);
// router.put("/forms/:id", bTamu.updateForm);
// router.delete("/forms/:id", bTamu.deleteForm);

module.exports = router;
