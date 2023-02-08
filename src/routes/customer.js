import { Router } from "express";
import { getCustomer, postCustomer } from "../controllers/costumers.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { customerInput } from "../schemas/customer.js";

const customerRouter = Router();

customerRouter.get("/customers", getCustomer);
customerRouter.post("/customers", validateSchema(customerInput), postCustomer);

export default customerRouter;
