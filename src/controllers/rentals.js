import { db } from "../config/database.js";

export async function postRental(req, res) {
  const { customerId, gameId, daysRented } = req.body;
  try {
    const gameInfo = await db.query("SELECT * from games where id = $1 ", [
      gameId,
    ]);
    if (gameInfo.rowCount < 1)
      return res.status(400).send("Jogo não encontrado");
    const customerInfo = await db.query(
      "SELECT * from customers where id = $1",
      [customerId]
    );
    if (customerInfo.rowCount < 1)
      return res.status(400).send("Cliente não encontrado");
    const openRentals = await db.query(
      'SELECT * from rentals where "gameId" = $1 and "returnDate" is null ',
      [gameId]
    );
    if (openRentals.rowCount >= gameInfo.rows[0].stockTotal)
      return res.status(400).send("Não há estoque disponível");

    await db.query(
      `
    INSERT INTO 
    rentals ("customerId", "gameId", "rentDate", "daysRented", "originalPrice") 
    VALUES ($1, $2, Now(), $3, $4)
    `,
      [
        customerId,
        gameId,
        daysRented,
        gameInfo.rows[0].pricePerDay * daysRented,
      ]
    );
    return res.sendStatus(201);
  } catch (error) {
    console.log(error.message);
    return res.status(500).send("Erro interno");
  }
}
