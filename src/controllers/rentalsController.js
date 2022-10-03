import dayjs from "dayjs";
import connection from "../database/database.js";
import rentalSchema from "../schemas/rentalsSchema.js";

async function creatRental(req, res) {
	const newRent = req.body;
	const validation = rentalSchema.validate(newRent);

	try {
		if (validation.error) {
			return res.status(400).send({ message: validation.error.message });
		}

		const validGame = await connection.query(
			"SELECT * FROM games WHERE id = $1;",
			[newRent.gameId],
		);

		const validCostumer = await connection.query(
			"SELECT * FROM customers WHERE id = $1;",
			[newRent.customerId],
		);

		if (!validCostumer.rows[0] || !validGame.rows[0]) {
			return res.sendStatus(400);
		}

		const rentDate = dayjs().format("YYYY-MM-DD");
		const originalPrice = newRent.daysRented * validGame.rows[0].pricePerDay;

		await connection.query(
			'INSERT INTO rentals ("customerId", "gameId", "daysRented", "rentDate", "originalPrice", "returnDate", "delayFee") VALUES ($1,$2,$3, $4, $5, $6, $7);',
			[
				newRent.customerId,
				newRent.gameId,
				newRent.daysRented,
				rentDate,
				originalPrice,
				null,
				null,
			],
		);

		res.sendStatus(201);
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
