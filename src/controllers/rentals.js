import { db } from "../config/database.js";

export async function getRentals(_, res) {
  try {
    const rentals = await db.query(`
    SELECT rentals.id, "customerId", "gameId", "rentDate", "daysRented", "returnDate",
    "originalPrice", "delayFee", games.name as "gameName", customers.name as "customerName"
    FROM rentals join customers on customers.id = rentals."customerId"
    join games on games.id = rentals."gameId"
    `);
    const rentalsObj = rentals.rows.map((r) => {
      const rental = r;
      rental.customer = {
        id: rental.customerId,
        name: rental.customerName,
      };
      rental.game = {
        id: rental.gameId,
        name: rental.gameName,
      };
      delete rental.gameName;
      delete rental.customerName;
      return rental;
    });
    return res.status(200).send(rentals.rows);
  } catch (error) {
    console.log(error.message);
    return res.status(500).send("Erro interno");
  }
}

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

export async function finishRental(req, res) {
  const { id } = req.params;
  try {
    const rentalObj = await db.query("SELECT * FROM rentals WHERE id = $1 ", [
      id,
    ]);
    if (rentalObj.rowCount < 1) return res.status(404).send("Não encontrado");
    const rental = rentalObj.rows[0];
    if (rental.returnDate) return res.status(400).send("Já finalizado");
    const rentalDate = new Date(rental.rentDate);
    const dueDate = new Date(
      rentalDate.getTime() + rental.daysRented * 1000 * 60 * 60 * 24
    );
    const today = new Date();
    today.setTime(today.setHours(0, 0, 0, 0));

    const timeDiff = today.getTime() - dueDate.getTime();
    const daysDiff =
      timeDiff > 0 ? Math.floor(timeDiff / (1000 * 60 * 60 * 24)) : 0;

    const feePerDay = Math.floor(rental.originalPrice / rental.daysRented);
    const delayFee = daysDiff ? daysDiff * feePerDay : null;

    await db.query(
      `
      UPDATE rentals
      SET 
        "returnDate" = Now(),
        "delayFee" = $1
      WHERE 
        id = $2
    `,
      [delayFee, id]
    );

    return res.status(200).send("OK");
  } catch (error) {
    console.log(error.message);
    return res.status(500).send("Erro interno");
  }
}
