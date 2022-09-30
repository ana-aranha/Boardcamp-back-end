import express from "express";
import cors from "cors";
import connection from "./database/database.js";

const app = express();
app.use(express.json());
app.use(cors());

app.get("/status", (req, res) => {
	res.send("Ok");
});

app.get("/categories", (req, res) => {
	connection.query("SELECT * FROM categories").then((categories) => {
		res.send(categories.rows);
	});
});

app.listen(4000, () => {
	console.log("Server listening on port 4000.");
});
