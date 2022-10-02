import express from "express";
import { creatGame, getGames } from "../controllers/gamesController.js";

const router = express.Router();

router.post("/games", creatGame);
router.get("/games", getGames);

export default router;
