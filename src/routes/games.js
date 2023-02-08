import { Router } from "express";
import { getGames, postGame } from "../controllers/games.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { gameInput } from "../schemas/game.js";

const gamesRouter = Router();

gamesRouter.get("/games", getGames);
gamesRouter.post("/games", validateSchema(gameInput), postGame);

export default gamesRouter;
