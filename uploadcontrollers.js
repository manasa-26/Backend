const fs = require("fs");
const path = require("path");
const mammoth = require("mammoth");
const pdfParse = require("pdf-parse");
const Document = require("../models/Document");

// 🔍 Helper to extract fields from text
const extractInfo = (text) => {
  const info = {
    name: "N/A",
    email: "N/A",
    github: "N/A",
    linkedin: "N/A",
    education: "N/A"
  };

  // Name: First non-empty line (basic heuristic)
  const lines = text.split("\n").map(line => line.trim()).filter(Boolean);
  if (lines.length) info.name = lines[0];

  // Email
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  if (emailMatch) info.email = emailMatch[0];

  // GitHub
  const githubMatch = text.match(/github\.com\/[a-zA-Z0-9_-]+/i);
  if (githubMatch) info.github = githubMatch[0];

  // LinkedIn
  const linkedinMatch = text.match(/linkedin\.com\/in\/[a-zA-Z0-9_-]+/i);
  if (linkedinMatch) info.linkedin = linkedinMatch[0];

  // Education (search for degree/college names)
  const eduMatch = text.match(/(B\.?E\.?|B\.?Tech\.?|Bachelor.*?|Master.*?|[A-Z][a-z]+ Institute of [A-Z][a-z]+)/);
  if (eduMatch) info.education = eduMatch[0];

  return info;
};

exports.uploadDoc = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const ext = path.extname(req.file.originalname).toLowerCase();
    const filePath = req.file.path;
    let textContent = "";

    if (ext === ".txt") {
      textContent = fs.readFileSync(filePath, "utf8");
    } else if (ext === ".docx") {
      const result = await mammoth.extractRawText({ path: filePath });
      textContent = result.value;
    } else if (ext === ".pdf") {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdfParse(dataBuffer);
      textContent = data.text;
    } else {
      return res.status(400).json({ message: "Unsupported file type" });
    }

    const truncated = textContent.substring(0, 500);
    const extracted = extractInfo(textContent);

    const doc = new Document({
      filename: req.file.originalname,
      content: truncated,
      extracted
    });

    await doc.save();

    res.status(200).json({
      message: "Uploaded",
      id: doc._id,
      content: doc.content,
      extracted
    });
  } catch (error) {
    console.error("❌ Upload error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getDoc = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) {
      return res.status(404).json({ message: "Document not found" });
    }
    res.status(200).json(doc);
  } catch (error) {
    console.error("❌ Get error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
