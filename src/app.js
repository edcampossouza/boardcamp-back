import express from "express";
import dotenv from "dotenv";
import gamesRouter from "./routes/games.js";
import customerRouter from "./routes/customer.js"
dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();
app.use(express.json())

app.use(gamesRouter);
app.use(customerRouter)

app.listen(PORT, () => console.log(`Servidor ouvindo na porta ${PORT}`));
