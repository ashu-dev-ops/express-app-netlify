// YOUR_BASE_DIRECTORY/netlify/functions/api.js

import express, { Router } from "express";
import serverless from "serverless-http";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { google } from "googleapis";

dotenv.config();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const api = express();
api.use(express.json()); // For parsing JSON request bodies
api.use(bodyParser.json());
const router = Router();

router.post("/exchange-token", async (req, res) => {
  // res.send("Hello World");
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
    console.error("Proxy exchange error:", err, err && err.message);
    res.status(500).json({ error: "Token exchange failed" });
  }
});

api.use("/api/", router);

export const handler = serverless(api);

// Now, you can test the CRUD operations at /api/! 🚀
