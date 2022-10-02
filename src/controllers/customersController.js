import connection from "../database/database.js";
import customerSchema from "../schemas/customerSchema.js";

async function creatCustomer(req, res) {
	const custumer = req.body;

	const validation = customerSchema.validate(custumer);

	if (validation.error) {
		return res.status(400).send({ message: validation.error.message });
	}

	const invalidCpf = await connection.query(
		"SELECT * FROM customers WHERE cpf LIKE $1;",
		[`${custumer.cpf}`],
	);

	if (invalidCpf.rows[0]) {
		return res.sendStatus(409);
	}

	await connection.query(
		"INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1,$2,$3, $4);",
		[custumer.name.trim(), custumer.phone, custumer.cpf, custumer.birthday],
	);

	res.sendStatus(201);
}

async function getCustomers(req, res) {}

async function updateCustomer(req, res) {}

async function getCustomer(req, res) {}

export { creatCustomer, getCustomer, updateCustomer, getCustomers };
