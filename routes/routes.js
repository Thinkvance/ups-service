import express from "express";

import getTrackingDetails from "../controller/tracking.js";
const router = express.Router();

router.route("/getTrackingStatusByAwb").post(getTrackingDetails);

export default router;