import { Router } from "express";
import {
  deleteRental,
  finishRental,
  getRentals,
  postRental,
} from "../controllers/rentals.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { rentalInput } from "../schemas/rental.js";

const rentalsRouter = Router();

rentalsRouter.get("/rentals", getRentals);
rentalsRouter.post("/rentals", validateSchema(rentalInput), postRental);
rentalsRouter.post("/rentals/:id/return", finishRental);
rentalsRouter.delete("/rentals/:id", deleteRental);

export default rentalsRouter;
