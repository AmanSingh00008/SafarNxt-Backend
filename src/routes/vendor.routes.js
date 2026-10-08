import { Router } from "express";
import { authenticateToken } from "../middleware/auth.middleware.js";



import {
  registerVendor,
  getAllVendors,
  getVendorById,
  updateVendor,
  approveVendor,
  rejectVendor,
  deleteVendor,
} from "../controllers/vendor.controller.js";

const router = Router();


// Register vendor
router.post("/", authenticateToken, registerVendor);

// Get all vendors
router.get("/", authenticateToken, getAllVendors);

// Get vendor by ID
router.get("/:vendorId", authenticateToken, getVendorById);

// Update vendor
router.put("/:vendorId", authenticateToken, updateVendor);

// Approve vendor
router.patch("/:vendorId/approve", authenticateToken, approveVendor);

// Reject vendor
router.patch("/:vendorId/reject", authenticateToken, rejectVendor);

// Delete vendor
router.delete("/:vendorId", authenticateToken, deleteVendor);


export default router;