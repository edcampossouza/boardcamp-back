import express from "express";
import dotenv from "dotenv";
import gamesRouter from "./routes/games.js";
import cors from "cors";
import customerRouter from "./routes/customer.js";
import rentalsRouter from "./routes/rentals.js";
dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();
app.use(express.json());
app.use(cors());

app.use(gamesRouter);
app.use(customerRouter);
app.use(rentalsRouter);

app.listen(PORT, () => console.log(`Servidor ouvindo na porta ${PORT}`));
