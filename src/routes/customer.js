import { Router } from "express";
import {
  getCustomer,
  getCustomerByID,
  postCustomer,
  putCustomer,
} from "../controllers/costumers.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { customerInput } from "../schemas/customer.js";

const customerRouter = Router();

customerRouter.get("/customers", getCustomer);
customerRouter.get("/customers/:id", getCustomerByID);
customerRouter.post("/customers", validateSchema(customerInput), postCustomer);
customerRouter.put(
  "/customers/:id",
  validateSchema(customerInput),
  putCustomer
);

export default customerRouter;
