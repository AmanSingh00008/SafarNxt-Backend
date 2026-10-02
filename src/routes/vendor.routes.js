import { Router } from "express";

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
router.post("/", registerVendor);

// Get all vendors
router.get("/", getAllVendors);

// Get vendor by ID
router.get("/:vendorId", getVendorById);

// Update vendor
router.put("/:vendorId", updateVendor);

// Approve vendor
router.patch("/:vendorId/approve", approveVendor);

// Reject vendor
router.patch("/:vendorId/reject", rejectVendor);

// Delete vendor
router.delete("/:vendorId", deleteVendor);


export default router;