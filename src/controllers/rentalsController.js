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

		const gamesFiltered = await connection.query(
			`SELECT * FROM rentals JOIN games ON rentals."gameId" = games.id JOIN categories ON games."categoryId"= categories.id WHERE rentals."gameId" = $1 AND rentals."returnDate" IS NULL;`,
			[newRent.gameId],
		);

		if (gamesFiltered.rows.length < gamesFiltered.rows[0].stockTotal) {
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

			return res.sendStatus(201);
		}

		res.sendStatus(400);
	} catch (error) {
		console.log(error);
		res.sendStatus(500);
	}
}

async function getRentals(req, res) {
	const customerId = req.query.customerId;
	const gameId = req.query.gameId;

	try {
		if (gameId) {
			const validGame = await connection.query(
				"SELECT * FROM games WHERE id = $1;",
				[gameId],
			);

			if (!validGame.rows[0]) {
				return res.sendStatus(400);
			}
			const gamesFiltered = await connection.query(
				`SELECT rentals.* , jsonb_build_object('id', customers.id, 'name', customers.name) as "customer", jsonb_build_object('id', games.id, 'name', games.name, 'categoryId', games."categoryId" ,'categoryName', categories.name) as "game" FROM rentals JOIN customers ON rentals."customerId"= customers.id JOIN games ON rentals."gameId" = games.id JOIN categories ON games."categoryId"= categories.id WHERE rentals."gameId" = $1;`,
				[gameId],
			);

			return res.send(gamesFiltered.rows);
		}

		if (customerId) {
			const validCustomer = await connection.query(
				"SELECT * FROM customers WHERE id = $1;",
				[customerId],
			);

			if (!validCustomer.rows[0]) {
				return res.sendStatus(400);
			}

			const customerFiltered = await connection.query(
				`SELECT rentals.* , jsonb_build_object('id', customers.id, 'name', customers.name) as "customer", jsonb_build_object('id', games.id, 'name', games.name, 'categoryId', games."categoryId" ,'categoryName', categories.name) as "game" FROM rentals JOIN customers ON rentals."customerId"= customers.id JOIN games ON rentals."gameId" = games.id JOIN categories ON games."categoryId"= categories.id WHERE rentals."customerId"= $1;`,
				[customerId],
			);

			return res.send(customerFiltered.rows);
		}

		connection
			.query(
				`SELECT rentals.* , jsonb_build_object('id', customers.id, 'name', customers.name) as "customer", jsonb_build_object('id', games.id, 'name', games.name, 'categoryId', games."categoryId" ,'categoryName', categories.name) as "game" FROM rentals JOIN customers ON rentals."customerId"= customers.id JOIN games ON rentals."gameId" = games.id JOIN categories ON games."categoryId"= categories.id;`,
			)
			.then((rentals) => res.send(rentals.rows));
	} catch (error) {
		console.log(error);
		res.sendStatus(500);
	}
}

async function deleteRentals(req, res) {
	const rentalId = req.params.id;

	try {
		const rentalFiltered = await connection.query(
			"SELECT * FROM rentals WHERE id = $1;",
			[rentalId],
		);

		if (!rentalFiltered.rows[0]) {
			return res.sendStatus(404);
		}

		if (rentalFiltered.rows[0].returnDate === null) {
			return res.sendStatus(400);
		}

		connection.query("DELETE FROM rentals WHERE id = $1;", [rentalId]);
		res.send(200);
	} catch (error) {
		console.log(error);
		res.sendStatus(500);
	}
}

async function returnRental(req, res) {
	const rentalId = req.params.id;
	const returnDate = dayjs().format("YYYY-MM-DD");
	const oneDay = 1000 * 60 * 60 * 24;

	try {
		const rentalFiltered = await connection.query(
			"SELECT * FROM rentals WHERE id = $1;",
			[rentalId],
		);

		if (!rentalFiltered.rows[0]) {
			return res.sendStatus(404);
		}

		if (rentalFiltered.rows[0].returnDate != null) {
			return res.sendStatus(400);
		}

		const rentDate = JSON.stringify(rentalFiltered.rows[0].rentDate).slice(
			1,
			11,
		);
		const daysPassed = Math.round(
			(Date.now() - dayjs(rentDate).valueOf() - oneDay) / oneDay,
		);
		const daysToDeadline = rentalFiltered.rows[0].daysRented - daysPassed;

		if (daysToDeadline < 0) {
			const delayFee =
				(rentalFiltered.rows[0].originalPrice /
					rentalFiltered.rows[0].daysRented) *
				Math.abs(daysToDeadline);

			connection.query(
				'UPDATE rentals SET "returnDate"=$1, "delayFee"=$2 WHERE id = $3;',
				[returnDate, delayFee, rentalId],
			);

			return res.sendStatus(200);
		}

		connection.query(
			'UPDATE rentals SET "returnDate"=$1, "delayFee"=$2 WHERE id = $3;',
			[returnDate, 0, rentalId],
		);
		res.sendStatus(200);
	} catch (error) {
		console.log(error);
		res.sendStatus(500);
	}
}

export { creatRental, getRentals, deleteRentals, returnRental };
