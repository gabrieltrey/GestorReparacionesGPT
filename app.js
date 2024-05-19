// app.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = 3000;

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'ggss',
    password: 'postgres',
    port: 5432,
});

app.use(bodyParser.json());
app.use(cors());

app.post('/register', async (req, res) => {
    const { name, phone, reference, details, price, deposit, status, entryDate, deliveryDate } = req.body;

    try {
        await pool.query(
            'INSERT INTO reparaciones (name, phone, reference, details, price, deposit, status, entry_date, delivery_date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
            [name, phone, reference, details, price, deposit, status, entryDate, deliveryDate]
        );
        res.status(200).send('Registro exitoso');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error en el registro');
    }
});

app.get('/repairs', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM reparaciones');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener los datos');
    }
});

app.put('/update-status/:id', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        await pool.query('UPDATE reparaciones SET status = $1 WHERE id = $2', [status, id]);
        res.status(200).send('Estado actualizado exitosamente');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al actualizar el estado');
    }
});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
