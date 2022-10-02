import connection from "../database/database.js";
import rentalSchema from "../schemas/rentalsSchema.js";

async function creatRental(req, res) {
	const newRental = req.body;
	const validation = rentalSchema.validate(newRental);

	try {
		if (validation.error) {
			return res.status(400).send({ message: validation.error.message });
		}
	} catch (error) {
		console.log(error);
		res.sendStatus(500);
	}
}

async function getRentals(req, res) {
	const customerId = req.query.customerId;
	const gameId = req.query.gameId;

	try {
	} catch (error) {
		console.log(error);
		res.sendStatus(500);
	}
}

async function deleteRentals(req, res) {
	const deletedRental = req.params.id;

	try {
	} catch (error) {
		console.log(error);
		res.sendStatus(500);
	}
}

async function returnRental(req, res) {
	const returnedRental = req.params.id;

	try {
	} catch (error) {
		console.log(error);
		res.sendStatus(500);
	}
}

export { creatRental, getRentals, deleteRentals, returnRental };
