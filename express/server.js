"use strict";
const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const path = require("path");
const serverless = require("serverless-http");
const app = express();
const bodyParser = require("body-parser");
const { google } = require("googleapis");
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const router = express.Router();
app.use(bodyParser.json());
app.post("/exchange-token", async (req, res) => {
  console.log("Proxy exchange token request received", req.body);
  const { code, redirectUrl } = req.body;
  if (!code || !redirectUrl) {
    return res.status(400).json({ error: "Missing code or redirectUrl" });
  }
  try {
    const oAuth2Client = new google.auth.OAuth2(
      CLIENT_ID,
      CLIENT_SECRET,
      redirectUrl
    );
    const { tokens } = await oAuth2Client.getToken(code);
    res.json({ tokens });
  } catch (err) {
    console.error("Proxy exchange error:", err, err.message);
    res.status(500).json({ error: "Token exchange failed" });
  }
});
app.use("/.netlify/functions/server", router); // path must route to lambda
app.use("/", (req, res) => {
  res.send("Hello World");
});

module.exports = app;
module.exports.handler = serverless(app);
