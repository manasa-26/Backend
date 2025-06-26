const express = require("express");
const multer = require("multer");
const path = require("path");
const { uploadDoc, getDoc } = require("../controllers/uploadController");

const router = express.Router();

// setup multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [".txt", ".docx", ".pdf"];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.includes(ext)) cb(null, true);
  else cb(new Error("Only .txt, .docx, and .pdf files allowed"));
};

const upload = multer({ storage, fileFilter });

router.post("/upload", upload.single("file"), uploadDoc);
router.get("/post/:id", getDoc);

module.exports = router;
