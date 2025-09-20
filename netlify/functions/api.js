// YOUR_BASE_DIRECTORY/netlify/functions/api.js

import express, { Router } from "express";
import serverless from "serverless-http";

const api = express();
api.use(express.json()); // For parsing JSON request bodies

const router = Router();

// In-memory array to store records
let records = [
    { id: 1, name: "Record 1" },
    { id: 2, name: "Record 2" }
];

// Create a new record
router.post("/", (req, res) => {
    const { id, name } = req.body;
    if (!id || !name) return res.status(400).json({ message: "ID and name are required" });

    records.push({ id, name });
    res.status(201).json({ message: "Record created", record: { id, name } });
});

router.get('/file',(req,res) => {
    res.sendFile(__dirname + "/index.html")
})

// Read all records
router.get("/", (req, res) => {
    res.json(records);
});

// Read a single record by ID
router.get("/:id", (req, res) => {
    const record = records.find(r => r.id === parseInt(req.params.id));
    if (!record) return res.status(404).json({ message: "Record not found" });

    res.json(record);
});

// Update a record by ID
router.put("/:id", (req, res) => {
    const { name } = req.body;
    const record = records.find(r => r.id === parseInt(req.params.id));

    if (!record) return res.status(404).json({ message: "Record not found" });
    if (!name) return res.status(400).json({ message: "Name is required" });

    record.name = name;
    res.json({ message: "Record updated", record });
});

// Delete a record by ID
router.delete("/:id", (req, res) => {
    records = records.filter(r => r.id !== parseInt(req.params.id));
    res.json({ message: "Record deleted" });
});

api.use("/api/", router);

export const handler = serverless(api);

// Now, you can test the CRUD operations at /api/! 🚀
