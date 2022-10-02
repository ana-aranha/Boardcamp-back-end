import express from "express";
import cors from "cors";
import categoriesRouter from "./routers/categoriesRouter.js";
import gamesRouter from "./routers/gamesRouter.js";

const app = express();
app.use(express.json());
app.use(cors());

app.get("/status", (req, res) => {
	res.send("Ok");
});

app.use(categoriesRouter);
app.use(gamesRouter);

app.listen(4000, () => {
	console.log("Server listening on port 4000.");
});
