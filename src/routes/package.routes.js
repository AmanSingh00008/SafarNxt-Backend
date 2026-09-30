import { Router } from "express";

import {
  createPackage,
  getAllPackages,
  getPackageById,
  updatePackage,
  deletePackage,
} from "../controllers/package.controller.js";

const router = Router();

router.post("/", createPackage);

router.get("/", getAllPackages);

router.get("/:packageId", getPackageById);

router.put("/:packageId", updatePackage);

router.delete("/:packageId", deletePackage);

export default router;