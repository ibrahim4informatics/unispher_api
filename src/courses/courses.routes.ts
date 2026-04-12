import { Router } from "express";

const router = Router();

/* =======================
   COURSE ROUTES
======================= */

// Create course (draft|pending)
router.post("/");

// Get courses (filters: approved, search, category...)
router.get("/");

// Get single course details
router.get("/:course_id");

// Update course (only  & owner)
router.patch("/:course_id");

// Delete course (only & owner)
router.delete("/:course_id");

// Submit course for review (draft → pending)
router.patch("/:course_id/submit");


/* =======================
   SECTIONS ROUTES
======================= */

// Create section
router.post("/:course_id/sections");

// Get all sections of course
router.get("/:course_id/sections");

// Update section
router.patch("/:course_id/sections/:section_id");

// Delete section
router.delete("/:course_id/sections/:section_id");

/* =======================
   LESSONS ROUTES
======================= */



/* =======================
   ENROLLMENT ROUTES
======================= */

// Student enroll
router.post("/:course_id/enroll");

// Student unenroll
router.delete("/:course_id/enroll");

export default router;