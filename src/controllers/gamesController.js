import connection from "../database/database.js";
import gameSchema from "../schemas/gameSchema.js";

async function creatGame(req, res) {
	const game = req.body;

	try {
		const validation = gameSchema.validate(game);
		const invalidCategory = await connection.query(
			"SELECT * FROM categories WHERE id = $1;",
			[`${game.categoryId}`],
		);

		if (validation.error) {
			return res.status(400).send({ message: validation.error.message });
		}

		if (!invalidCategory.rows[0]) {
			return res.status(400).send({ message: "Categoria inválida" });
		}

		const invalidGame = await connection.query(
			"SELECT * FROM games WHERE name ILIKE $1;",
			[`${game.name}`],
		);

		if (invalidGame.rows[0]) {
			return res.sendStatus(409);
		}

		await connection.query(
			'INSERT INTO games (name, image, "stockTotal", "pricePerDay", "categoryId") VALUES ($1,$2,$3, $4,$5);',
			[
				game.name.trim(),
				game.image.trim(),
				game.stockTotal,
				game.pricePerDay,
				game.categoryId,
			],
		);
		res.sendStatus(201);
	} catch (error) {
		console.log(error);
		res.sendStatus(500);
	}
}

async function getGames(req, res) {
	const gameName = req.query.name;

	try {
		if (gameName) {
			const game = await connection.query(
				'SELECT games.*, categories.name as "categoryName" FROM games JOIN categories ON games."categoryId"= categories.id WHERE games.name ILIKE $1;',
				[`${gameName}%`],
			);
			return res.send(game.rows);
		}

		connection
			.query(
				'SELECT games.*, categories.name as "categoryName" FROM games JOIN categories ON games."categoryId"= categories.id;',
			)
			.then((games) => {
				res.send(games.rows);
			});
	} catch (error) {
		console.log(error);
		res.sendStatus(500);
	}
}

export { creatGame, getGames };
