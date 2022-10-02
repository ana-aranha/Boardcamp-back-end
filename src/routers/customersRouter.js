import express from "express";
import {
	creatCustomer,
	getCustomerById,
	updateCustomer,
	getCustomers,
} from "../controllers/customersController.js";

const router = express.Router();

router.post("/customers", creatCustomer);
router.get("/customers", getCustomers);
router.get("/customers/:id", getCustomerById);
router.put("/customers/:id");

export default router;
