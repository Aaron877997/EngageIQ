const express = require("express");
const csv = require("csvtojson");
const path = require("path");
const fs = require("fs");
const csvParser = require("csv-parser");

const router = express.Router();

// ================= ROOT =================

router.get("/", async (req, res) => {
  try {
    const csvFilePath = path.join(__dirname, "../data/linkedin-company-information.csv");

    const jsonArray = await csv().fromFile(csvFilePath);

    const firstTen = jsonArray.slice(0, 10);

    res.json(firstTen);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ================= FIND COMPANY =================

router.get("/findCompany", async (req, res) => {
  try {
    let { companyId, companyName } = req.query;

    const csvFilePath = path.join(__dirname, "../data/company_data.csv");

    const jsonArray = await csv().fromFile(csvFilePath);

    companyId = companyId?.trim();
    companyName = companyName?.trim().toLowerCase();

    let filtered = jsonArray;

    if (companyId) {
      filtered = filtered.filter(c => c.id?.toString() === companyId);
    }

    if (companyName) {
      filtered = filtered.filter(c => c.name?.toLowerCase().includes(companyName));
    }

    res.json(filtered);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// ================= POSTS =================

router.get("/getCompanyPosts", async (req, res) => {
  try {
    let { companyName } = req.query;
    companyName = companyName?.trim().toLowerCase();
    console.log("Received companyName:", companyName);

    const csvFilePath = path.join(__dirname, "../data/company_data.csv");
    const jsonArray = await csv().fromFile(csvFilePath);
    console.log("Total rows in CSV:", jsonArray.length);

    const filtered = jsonArray
      .filter(row => {
        const rowName = row.name?.toLowerCase().trim();
        const matches = rowName && rowName.includes(companyName);
        if (matches) console.log("Matching row:", row.name, row.content);
        return matches;
      })
      .map(row => {

        const followers = parseInt((row.followers || "0").replace(/,/g, "")) || 0;

        let daysSincePosted = 0;
        const t = row.time_spent || "";

        if (t.includes("week")) daysSincePosted = parseInt(t) * 7;
        else if (t.includes("day")) daysSincePosted = parseInt(t);
        else if (t.includes("hour")) daysSincePosted = parseInt(t) / 24;
        else if (t.includes("month")) daysSincePosted = parseInt(t) * 30;

        return {
          ...row,
          followers,
          daysSincePosted: Math.round(daysSincePosted),
          reactions: parseInt(row.reactions) || 0,
          comments: parseInt(row.comments) || 0
        };
      });

    console.log("Filtered posts count:", filtered.length);
    res.json(filtered);

  } catch (error) {
    console.log(error);
    res.json([]);
  }
});


// IMPORTANT
module.exports = router;
