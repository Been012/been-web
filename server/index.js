const express = require("express");
const path = require("path");
const { insertComment, getComments } = require("./db");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));

// Rate limiting (simple in-memory)
const rateMap = new Map();
const RATE_LIMIT = 5; // max requests
const RATE_WINDOW = 60_000; // per 1 minute

function rateLimit(req, res, next) {
    const ip = req.ip;
    const now = Date.now();
    const entry = rateMap.get(ip);

    if (!entry || now - entry.start > RATE_WINDOW) {
        rateMap.set(ip, { start: now, count: 1 });
        return next();
    }

    entry.count++;
    if (entry.count > RATE_LIMIT) {
        return res.status(429).json({ error: "Too many requests. Try again later." });
    }

    next();
}

// Clean up stale rate limit entries every 5 minutes
setInterval(() => {
    const now = Date.now();
    for (const [ip, entry] of rateMap) {
        if (now - entry.start > RATE_WINDOW) {
            rateMap.delete(ip);
        }
    }
}, 5 * 60_000);

// Sanitize input
function sanitize(str) {
    return str.replace(/[<>&"']/g, (ch) => {
        const map = { "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&#39;" };
        return map[ch];
    });
}

// Routes
app.get("/api/comments", (_req, res) => {
    const comments = getComments.all();
    res.json(comments);
});

app.post("/api/comments", rateLimit, (req, res) => {
    const { name, message } = req.body;

    if (!name || !message || typeof name !== "string" || typeof message !== "string") {
        return res.status(400).json({ error: "Name and message are required." });
    }

    const trimmedName = name.trim();
    const trimmedMessage = message.trim();

    if (trimmedName.length === 0 || trimmedName.length > 50) {
        return res.status(400).json({ error: "Name must be 1-50 characters." });
    }

    if (trimmedMessage.length === 0 || trimmedMessage.length > 500) {
        return res.status(400).json({ error: "Message must be 1-500 characters." });
    }

    const safeName = sanitize(trimmedName);
    const safeMessage = sanitize(trimmedMessage);

    insertComment.run(safeName, safeMessage);
    res.status(201).json({ success: true });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
