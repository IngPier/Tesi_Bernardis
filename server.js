const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Percorso per il file Arduino_Sito.ino
const FILE_PATH = path.join(__dirname, 'public', 'Arduino_Sito', 'Arduino_Sito.ino');

app.use(express.static('public')); // Serve file statici dalla cartella 'public'

app.get('/file-content', (req, res) => {
    fs.readFile(FILE_PATH, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Errore nella lettura del file.');
        }
        res.send(data);
    });
});

app.listen(PORT, () => {
    console.log(`Server in esecuzione su http://localhost:${PORT}`);
});
