import { Router } from "express";
import { postRental } from "../controllers/rentals.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { rentalInput } from "../schemas/rental.js";

const rentalsRouter = Router();

rentalsRouter.post("/rentals", validateSchema(rentalInput), postRental);

export default rentalsRouter;
