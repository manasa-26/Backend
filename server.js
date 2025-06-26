const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require("./routes/auth");
const uploadRoutes = require("./routes/upload");

app.use("/api/auth", authRoutes);
app.use("/api/docs", uploadRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)

.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error("❌ DB Error:", err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
