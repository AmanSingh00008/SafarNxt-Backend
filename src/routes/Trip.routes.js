import e, { Router } from "express";
const router = Router();

import {
  Trips,
  getTrips,
  updateTrips,
  DeleteTrips,
} from "../controllers/trip.controllers.js";

router.route("/Trips").post(Trips);

router.route("/getTrips").get(getTrips);

router.route("/updateTrips").put(updateTrips);

router.route("/DeleteTrips").delete(DeleteTrips);

export default router;