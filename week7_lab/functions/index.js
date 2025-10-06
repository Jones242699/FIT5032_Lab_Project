// functions/index.js

// Import Cloud Functions (v1 HTTPS) and utilities
const {setGlobalOptions} = require("firebase-functions");
const {onRequest} = require("firebase-functions/https");
const logger = require("firebase-functions/logger");

// Firebase Admin SDK to access Firestore
const admin = require("firebase-admin");

// CORS middleware to handle cross-origin requests
const cors = require("cors");

// Limit concurrent instances (helps control cost)
setGlobalOptions({maxInstances: 10});

// Initialize Admin app once
if (!admin.apps.length) {
  admin.initializeApp();
}
const db = admin.firestore();

// Configure CORS; 'origin: true' echoes the request's origin (dev-friendly)
const corsMiddleware = cors({origin: true});

// HTTP function: count documents in "books" collection
exports.countBooks = onRequest(async (req, res) => {
  // Wrap handler with CORS (handles GET and preflight OPTIONS)
  return corsMiddleware(req, res, async () => {
    // Handle CORS preflight quickly
    if (req.method === "OPTIONS") {
      res.set("Access-Control-Allow-Methods", "GET, OPTIONS");
      res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
      res.set("Access-Control-Max-Age", "3600");
      return res.status(204).send("");
    }

    // Only allow GET
    if (req.method !== "GET") {
      return res.status(405).json({error: "Method Not Allowed. Use GET."});
    }

    try {
      // Query Firestore and count docs
      const snapshot = await db.collection("books").get();
      const count = snapshot.size;

      // Return a clear JSON payload
      return res.status(200).json({count});
    } catch (err) {
      // Log and return a safe error payload
      logger.error("Failed to count books", err);
      return res.status(500).json({
        error: "Internal Server Error while counting books.",
        details: err.message,
      });
    }
  });
});
