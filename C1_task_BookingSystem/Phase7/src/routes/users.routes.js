import express from "express";
import pool from "../db/pool.js";
import { requireAuth } from "../../middleware/auth.middleware.js";

const router = express.Router();

/* =====================================================
   GET /api/users - Get all users (for dropdown)
   Returns simplified user list with id, email, first_name, last_name
===================================================== */
router.get("/", requireAuth, async (req, res) => {
  try {
    const sql = `
      SELECT id, first_name, last_name, email, role
      FROM users
      WHERE is_active = true
      ORDER BY email ASC
    `;

    const { rows } = await pool.query(sql);

    return res.status(200).json({
      ok: true,
      data: rows,
    });
  } catch (err) {
    console.error("GET /api/users failed:", err);
    return res.status(500).json({
      ok: false,
      error: "Internal server error",
      details: err.message,
    });
  }
});

export default router;
