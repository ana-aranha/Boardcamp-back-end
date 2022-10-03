import express from "express";
import cors from "cors";
import categoriesRouter from "./routers/categoriesRouter.js";
import gamesRouter from "./routers/gamesRouter.js";
import customersRouter from "./routers/customersRouter.js";
import rentalsRouter from "./routers/rentalsRouter.js";

const app = express();
app.use(express.json());
app.use(cors());

app.get("/status", (req, res) => {
	res.send("Ok");
});

app.use(categoriesRouter);
app.use(gamesRouter);
app.use(customersRouter);
app.use(rentalsRouter);

app.listen(4000, () => {
	console.log("Server listening on port 4000.");
});
