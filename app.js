// app.js
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
const port = 3000;
const enproceso = "En Proceso";
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "ggss",
  password: "postgres",
  port: 5432,
});

app.use(bodyParser.json());
app.use(cors());

app.post("/register", async (req, res) => {
  const {
    name,
    phone,
    reference,
    details,
    price,
    deposit,
    status,
    entryDate,
    deliveryDate,
  } = req.body;
  try {
    await pool.query(
      "INSERT INTO reparaciones (name, phone, reference, details, price, deposit, status, entry_date, delivery_date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
      [
        name,
        phone,
        reference,
        details,
        price,
        deposit,
        status,
        entryDate,
        deliveryDate,
      ]
    );
    res.status(200).send("Registro exitoso");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error en el registro");
  }
});

app.get("/repairs", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM reparaciones");
    console.log(enproceso);
    res.status(200).json(result.rows);
    console.log(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al obtener los datos");
  }
});

app.put("/update-status/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    await pool.query("UPDATE reparaciones SET status = $1 WHERE id = $2", [
      status,
      id,
    ]);
    res.status(200).send("Estado actualizado exitosamente");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al actualizar el estado");
  }
});

app.get("/repairs/status/:status", async (req, res) => {
  const { status } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM reparaciones WHERE status = $1",
      [status]
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al obtener las reparaciones por estado");
  }
});
// ruta para buscar alguna reparacion por numero telefonico o nombre del cliente.
app.get("/repairs/search", async (req, res) => {
  const { query } = req.query;
  try {
    const result = await pool.query(
      `SELECT * FROM reparaciones WHERE name ILIKE $1 OR phone ILIKE $1`,
      [`%${query}%`]
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al buscar las reparaciones");
  }
});

// Ruta para actualizar datos de la reparación
app.put("/repairs/:id", async (req, res) => {
  const { id } = req.params;
  const {
    name,
    phone,
    reference,
    details,
    price,
    deposit,
    status,
    entryDate,
    repairDate,
    deliveryDate,
  } = req.body;
  try {
    console.log(req.body);
    await pool.query(
      `UPDATE reparaciones SET name = $1, phone = $2, reference = $3, details = $4, price = $5, deposit = $6, status = $7, entry_date = $8, repair_date = $9 ,delivery_date = $10 WHERE id = $11`,
      [
        name,
        phone,
        reference,
        details,
        price,
        deposit,
        status,
        entryDate,
        repairDate,
        deliveryDate,
        id,
      ]
    );
    res.send(`Reparación actualizada exitosamente con idddd $11`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al actualizar la reparación");
  }
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
