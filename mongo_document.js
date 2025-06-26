const mongoose = require("mongoose");

const docSchema = new mongoose.Schema({
  filename: String,
  content: String,
  uploadedAt: { type: Date, default: Date.now },
  extracted: {
    name: { type: String, default: "N/A" },
    email: { type: String, default: "N/A" },
    github: { type: String, default: "N/A" },
    linkedin: { type: String, default: "N/A" },
    education: { type: String, default: "N/A" }
  }
});

module.exports = mongoose.model("Document", docSchema);
