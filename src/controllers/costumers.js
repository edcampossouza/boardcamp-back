import { db } from "../config/database.js";

export async function getCustomer(_, res) {
  try {
    const customers = await db.query("SELECT * FROM customers");
    return res.status(200).send(customers.rows);
  } catch (error) {
    console.log(error.message);
    return res.status(500).send("Erro interno");
  }
}

export async function getCustomerByID(req, res) {
  const { id } = req.params;
  try {
    const customer = await db.query("SELECT * FROM customers WHERE id = $1", [
      id,
    ]);
    if (customer.rowCount < 1)
      return res.status(404).send("Cliente não encontrado");
    return res.status(200).send(customer.rows[0]);
  } catch (error) {
    console.log(error.message);
    return res.status(500).send("Erro interno");
  }
}

export async function postCustomer(req, res) {
  const customer = req.body;
  const { name, phone, cpf, birthday } = customer;
  try {
    //verifica existencia cliente
    const costumerExists = await db.query(
      "SELECT name FROM customers WHERE cpf = $1",
      [cpf]
    );
    if (costumerExists.rowCount !== 0)
      return res.status(409).send("Cliente já existe");

    //insere

    db.query(
      'INSERT INTO customers ("name", "phone", "cpf", "birthday") values ($1, $2, $3, $4) ',
      [name, phone, cpf, birthday]
    );
    return res.status(201).send("Cliente criado");
  } catch (error) {
    console.log(error.message);
    return res.status(500).send("Erro interno");
  }
}
