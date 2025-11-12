const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());

const API_TOKEN = '7e8d355a8f9b43b0bc5c2c3455f892b0';

app.get('/apl', async (req, res) => {
    try {
        const response = await fetch('https://api.football-data.org/v4/competitions/PL/standings', {
            headers: { 'X-Auth-Token': API_TOKEN }
        });
        const data = await response.json();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => console.log(`Proxy сервер работает на http://localhost:${PORT}`));
