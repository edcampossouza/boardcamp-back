import { db } from "../config/database.js";

export async function getGames(req, res) {
  const { name } = req.query;
  const { offset, limit } = req.query;
  let queryIndex = 1;
  let query = name
    ? "SELECT * FROM games where LOWER(name) like LOWER($1)"
    : "SELECT * FROM games";
  const values = name ? [`${name}%`] : [];
  if (name) queryIndex++;
  if (offset) {
    query += ` OFFSET $${queryIndex++} `;
    values.push(offset);
  }
  if (limit) {
    query += ` LIMIT $${queryIndex++} `;
    values.push(limit);
  }
  try {
    const { rows } = await db.query(query, values);
    return res.status(200).send(rows);
  } catch (error) {
    console.log(error.message);
    return res.status(500).send("Erro interno");
  }
}

export async function postGame(req, res) {
  const game = req.body;
  const { name, image, stockTotal, pricePerDay } = game;
  try {
    // verifica unicidade do name
    const gameExists = await db.query(
      'SELECT "name" FROM games WHERE "name" = $1 ',
      [name]
    );
    if (gameExists.rowCount !== 0)
      return res.status(409).send("Jogo já existe");

    // insere
    await db.query(
      'INSERT INTO games("name", "image", "stockTotal", "pricePerDay") VALUES ($1, $2, $3, $4)',
      [name, image, stockTotal, pricePerDay]
    );
    return res.status(201).send("Jogo criado");
  } catch (error) {
    console.log(error.message);
    return res.status(500).send("Erro interno");
  }
}
