const express = require("express");
const minioClient = require("../services/minio");
const mime = require("mime-types");
const router = express.Router();
require("dotenv").config();
const rr = require("../controllers/UserController");
const rc = require("../controllers/ChatController");
const roleController = require("../controllers/RoleController");
const kompilasiCont = require("../controllers/KompilasiController");
const penugasan = require("../controllers/PenugasanController");
const permintaan = require("../controllers/PermintaanController");
const auditCon = require("../controllers/AuditKkaController");
const notifCon = require("../controllers/NotifController");

// Import multer and upload setup
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });

//auth
router.post("/register", rr.register);
router.post("/login", rr.login);

//user
router.get("/user/all", rr.getall);
router.delete("/user/:id", rr.delete);

//chats
router.post("/chats", rc.save);
router.get("/chats/:pengirim", rc.getchat);

//roles
router.post("/roles", roleController.add);
router.get("/roles", roleController.get);
router.get("/roles/user", roleController.getAllRolesWithUsers);
router.put("/roles/:id", roleController.update);
router.delete("/roles/:id", roleController.delete);

//kompilasi
router.post("/kompilasi", kompilasiCont.add);
router.post("/rekomendasi", kompilasiCont.addRekom);
router.post("/aksi", kompilasiCont.addAksi);
router.get("/kompilasi", kompilasiCont.get);
router.get("/kompilasi/:id", kompilasiCont.getOne);
router.put("/kompilasi/:id", kompilasiCont.update);
router.put("/rekomendasi/:id", kompilasiCont.UpdateRekom);
router.delete("/kompilasi/:id", kompilasiCont.delete);
router.delete("/kompilasi/aksi/:id", kompilasiCont.deleteAksi);
router.delete("/kompilasi/rekomendasi/:id", kompilasiCont.deleteRekomendasi);

//roles
router.post("/penugasan", penugasan.add);
router.get("/penugasan", penugasan.get);
router.get("/penugasan/:id", penugasan.getOne);
router.put("/penugasan/:id", penugasan.update);
router.delete("/penugasan/:id", penugasan.delete);

//notif
router.post("/notif", notifCon.add);
router.get("/notif/by/user/:id_user", notifCon.getByUser);
router.get("/notif", notifCon.get);
router.get("/notif/read/:id/:id_user", notifCon.baca); //untuk baca kirim id notif dan id user
router.put("/notif/:id", notifCon.update);
router.delete("/notif/:id", notifCon.delete);

//permintaan
router.post("/permintaan", upload.single("file"), permintaan.add);
router.get("/permintaan", permintaan.get);
router.get("/permintaan/:id", permintaan.getOne);
router.get("/permintaan/:id", permintaan.getOne);
router.put("/permintaan/:id", permintaan.update);
router.delete("/permintaan/:id", permintaan.delete);
router.post("/permintaan/status", permintaan.updateStatus);

//audit_kka
router.post("/audit_kka/awal", auditCon.firstAdd);
router.post(
  "/audit_kka/user/file",
  upload.single("file"),
  auditCon.userFileAdd
);
router.post(
  "/audit_kka/obrik/file",
  upload.single("file"),
  auditCon.obrikFileAdd
);

router.post(
  "/audit_kka/bpkp/file",
  upload.single("file"),
  auditCon.bpkpFileAdd
);
router.get("/audit_kka/user/file/:id_penugasan", auditCon.userFileGet);

router.post(
  "/audit_kka",
  upload.fields([
    { name: "file_kesimpulan", maxCount: 1 }, // Single file upload for file_kesimpulan
    { name: "file_bukti_dukung", maxCount: 1 }, // Single file upload for file_bukti_dukung
    { name: "hasil_pengujian", maxCount: 5 }, // Up to 5 files for hasil_pengujian (adjust maxCount as needed)
  ]),
  auditCon.add
);
router.get("/audit_kka", auditCon.get);
router.get("/audit_kka/:id", auditCon.getOne);
router.get("/audit_kka/penugasan/:id_penugasan", auditCon.getOnePenugasan);
router.put("/audit_kka/:id", auditCon.update);
router.delete("/audit_kka/:id", auditCon.delete);

// Health check route
router.get("/health", (req, res) => {
  res.status(200).send("Server is healthy!");
});

//? showfile MinIO
router.get("/file/:objectName", (req, res) => {
  const { objectName } = req.params;

  minioClient.getObject(
    process.env.MINIO_BUCKET,
    objectName,
    (err, dataStream) => {
      if (err) {
        console.error("Error fetching object from MinIO:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      const mimeType = mime.lookup(objectName) || "application/octet-stream";
      res.setHeader("Content-Disposition", "inline");
      res.setHeader("Content-Type", mimeType);
      res.setHeader(
        "Cache-Control",
        "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0"
      );

      dataStream.on("error", (streamErr) => {
        console.error("Error during streaming:", streamErr);
        res.status(500).json({ error: "Error during streaming" });
      });

      dataStream.pipe(res);
    }
  );
});

module.exports = router;
