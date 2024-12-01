const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(cors());

// Endpoint pour recevoir les données
app.post('/data', (req, res) => {
    console.log('Données reçues :', req.body);
    res.sendStatus(200);
});

app.listen(PORT, () => {
    console.log(`Serveur Node.js en écoute sur http://localhost:${PORT}`);
});
