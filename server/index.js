const express = require("express");
const cors = require("cors");

const analyticsRoutes = require("./routes/analytics");
const aiQueryRoutes = require("./routes/aiQuery");
const platformRoutes = require("./routes/platformAnalytics");
const recommendationRoutes = require("./routes/recommendations");
const timelineRoutes = require("./routes/engagementTimeline");
const sentimentRoutes = require("./routes/sentimentAnalytics");
const exportRoutes = require("./routes/exportReport");
const companyRoutes = require("./routes/CompanyRoutes");
const postOptimizerRoutes = require("./routes/postOptimizer");
const mlRoutes = require("./routes/mlRoutes");

const { predictEngagement } = require("../ml/engagementPredictor");

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

app.use("/api", analyticsRoutes);
app.use("/api", aiQueryRoutes);
app.use("/api", platformRoutes);
app.use("/api", recommendationRoutes);
app.use("/api", timelineRoutes);
app.use("/api", sentimentRoutes);
app.use("/api", exportRoutes);
app.use("/api", postOptimizerRoutes);
app.use("/api", mlRoutes);

app.use("/api/companies", companyRoutes);

app.post("/api/predict-engagement", (req, res) => {
  try {
    const result = predictEngagement(req.body);
    res.json(result);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Prediction failed" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
