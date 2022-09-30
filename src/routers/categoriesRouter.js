import express from "express";
import {
	getCategories,
	createCategories,
} from "../controllers/categoriesController.js";

const router = express.Router();

router.get("/categories", getCategories);
router.post("/categories", createCategories);

export default router;
