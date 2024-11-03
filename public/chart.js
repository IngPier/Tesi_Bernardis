// Inizializzazione dei grafici
const ctxPosizione = document.getElementById('posizioneAngolareChart').getContext('2d');
const ctxVelocita = document.getElementById('velocitaAngolareChart').getContext('2d');
const ctxAccelerazione = document.getElementById('accelerazioneAngolareChart').getContext('2d');
const ctxJerk = document.getElementById('jerkChart').getContext('2d');

// Dati iniziali
let time = 0;
const timeStep = 1; // secondi
const maxDataPoints = 60; // Numero massimo di punti dati nel grafico

// Dati per i grafici
const posizioneData = [];
const velocitaData = [];
const accelerazioneData = [];
const jerkData = [];
const timeLabels = [];

// Posizione iniziale casuale tra 180.000 e 182.000
let posizione = parseFloat((Math.random() * 2 + 180).toFixed(3)); // Posizione iniziale

// Velocità, accelerazione e jerk iniziali
let velocita = 0;
let accelerazione = 0;
let jerk = 0;

// Creazione dei grafici
const posizioneChart = new Chart(ctxPosizione, {
    type: 'line',
    data: {
        labels: timeLabels,
        datasets: [{
            label: 'Posizione Angolare',
            data: posizioneData,
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Tempo (s)'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Posizione (°)'
                }
            }
        }
    }
});

const velocitaChart = new Chart(ctxVelocita, {
    type: 'line',
    data: {
        labels: timeLabels,
        datasets: [{
            label: 'Velocità Angolare',
            data: velocitaData,
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Tempo (s)'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Velocità (°/s)'
                }
            }
        }
    }
});

const accelerazioneChart = new Chart(ctxAccelerazione, {
    type: 'line',
    data: {
        labels: timeLabels,
        datasets: [{
            label: 'Accelerazione Angolare',
            data: accelerazioneData,
            borderColor: 'rgba(54, 162, 235, 1)',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Tempo (s)'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Accelerazione (°/s²)'
                }
            }
        }
    }
});

const jerkChart = new Chart(ctxJerk, {
    type: 'line',
    data: {
        labels: timeLabels,
        datasets: [{
            label: 'Jerk',
            data: jerkData,
            borderColor: 'rgba(255, 206, 86, 1)',
            backgroundColor: 'rgba(255, 206, 86, 0.2)',
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Tempo (s)'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Jerk (°/s³)'
                }
            }
        }
    }
});

// Variabile per il timer di aggiornamento
let updateInterval;

// Funzione per iniziare la comunicazione
function startCommunication() {
    console.log("Inizio comunicazione con Arduino...");
    
    // Inizia l'aggiornamento dei grafici ogni 200 ms
    updateInterval = setInterval(updateCharts, 200);
    
    // Disabilita i pulsanti durante la comunicazione
    document.getElementById("start-communication-btn").disabled = true; // Disabilita il pulsante di inizio
    document.getElementById("stop-communication-btn").disabled = false; // Abilita il pulsante di stop
    document.getElementById("clear-charts-btn").disabled = true; // Disabilita il pulsante di pulizia grafici
}

// Funzione per fermare la comunicazione
function stopCommunication() {
    console.log("Fine comunicazione con Arduino...");
    
    // Ferma l'aggiornamento dei grafici
    clearInterval(updateInterval);
    
    // Abilita i pulsanti dopo aver fermato la comunicazione
    document.getElementById("start-communication-btn").disabled = false; // Riabilita il pulsante di inizio
    document.getElementById("stop-communication-btn").disabled = true; // Disabilita il pulsante di stop
    document.getElementById("clear-charts-btn").disabled = false; // Abilita il pulsante di pulizia grafici
}

// Funzione per pulire i grafici
function clearCharts() {
    if (confirm("Sei sicuro di voler pulire i grafici?")) {
        // Cancella i dati dai grafici
        posizioneData.length = 0;
        velocitaData.length = 0;
        accelerazioneData.length = 0;
        jerkData.length = 0;
        timeLabels.length = 0;

        // Aggiorna i grafici
        posizioneChart.update();
        velocitaChart.update();
        accelerazioneChart.update();
        jerkChart.update();
    }
}

// Funzione per aggiornare i dati dei grafici
function updateCharts() {
    // Aggiorna il tempo
    time += timeStep;

    // Genera una variazione della posizione casuale per simulare un movimento
    const variazionePosizione = (Math.random() * 2 - 1).toFixed(3); // Variazione casuale della posizione
    posizione += parseFloat(variazionePosizione); // Aggiorna la posizione

    // Calcola la velocità (differenza di posizione nel tempo)
    velocita = (posizioneData.length > 0) 
                ? (posizione - posizioneData[posizioneData.length - 1]) / timeStep 
                : 0;

    // Calcola l'accelerazione (differenza di velocità nel tempo)
    accelerazione = (velocitaData.length > 0) 
                    ? (velocita - velocitaData[velocitaData.length - 1]) / timeStep 
                    : 0;

    // Calcola il jerk (differenza di accelerazione nel tempo)
    jerk = (accelerazioneData.length > 0) 
            ? (accelerazione - accelerazioneData[accelerazioneData.length - 1]) / timeStep 
            : 0;

    // Se il numero di punti supera il massimo, rimuovi il primo dato
    if (timeLabels.length > maxDataPoints) {
        posizioneData.shift();
        velocitaData.shift();
        accelerazioneData.shift();
        jerkData.shift();
        timeLabels.shift();
    }

    // Aggiungi i nuovi dati ai grafici
    posizioneData.push(posizione.toFixed(3)); // Aggiungi posizione
    velocitaData.push(velocita.toFixed(3)); // Aggiungi velocità
    accelerazioneData.push(accelerazione.toFixed(3)); // Aggiungi accelerazione
    jerkData.push(jerk.toFixed(3)); // Aggiungi jerk

    // Aggiungi l'etichetta del tempo
    timeLabels.push(time);

    // Aggiorna i grafici
    posizioneChart.update();
    velocitaChart.update();
    accelerazioneChart.update();
    jerkChart.update();
}
