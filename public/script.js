function toggleNightMode() {
    document.body.classList.toggle('bg-dark');
    document.body.classList.toggle('text-light');
}

// Funzione per caricare il codice Arduino
function loadArduinoCode() {
    const url = 'https://raw.githubusercontent.com/IngPier/Tesi_Bernardis/master/public/Arduino_Sito/Arduino_Sito.ino';
    console.log("Attempting to load Arduino code from:", url); // Log dell'URL
    fetch(url)
        .then(response => {
            if (!response.ok) { 
                throw new Error('Rete non ok: ' + response.status);
            }
            return response.text();
        })
        .then(code => {
            displayArduinoCode(code); // Usa la nuova funzione per mostrare il codice
            hljs.highlightElement(document.querySelector('#arduino-code code')); // Evidenzia il codice
        })
        .catch(error => {
            const errorMessage = 'Errore nel caricamento del codice: ' + error.message;
            displayArduinoCode(errorMessage); // Mostra l'errore con numeri di riga
            hljs.highlightElement(document.querySelector('#arduino-code code')); // Evidenzia l'errore
        });
}

// Funzione per visualizzare il codice Arduino con numeri di riga
function displayArduinoCode(code) {
    const lines = code.split('\n');

    const lineNumbersContainer = document.getElementById('line-numbers');
    lineNumbersContainer.innerHTML = ''; // Pulisci il contenitore

    const codeContentContainer = document.getElementById('code-content');
    codeContentContainer.innerHTML = ''; // Pulisci il contenitore

    lines.forEach((line, index) => {
        lineNumbersContainer.innerHTML += (index + 1) + '<br>'; // Aggiungi numero di riga
        line = line.replace(/\t/g, '    '); // Sostituisci i tab con spazi
        codeContentContainer.innerHTML += line + '\n'; // Aggiungi codice con \n
    });

    // Usa <pre> per mantenere la formattazione
    codeContentContainer.innerHTML = '<pre>' + codeContentContainer.innerHTML + '</pre>';
}


// Aggiungere un evento al collapsible
$('#collapseOne').on('show.bs.collapse', function () {
    loadArduinoCode(); // Carica il codice Arduino quando il collapsible viene espanso
});
