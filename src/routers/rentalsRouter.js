import express from "express";
import {
	creatRental,
	getRentals,
	deleteRentals,
	returnRental,
} from "../controllers/rentalsController.js";

const router = express.Router();

router.post("/rentals", creatRental);
router.get("/rentals", getRentals);
router.post("/rentals/:id/return", returnRental);
router.delete("/rentals/:id", deleteRentals);

export default router;
