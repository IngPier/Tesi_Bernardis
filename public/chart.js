// Inizializzazione dei grafici
const ctxPosizione = document.getElementById('posizioneAngolareChart').getContext('2d');
const ctxVelocita = document.getElementById('velocitaAngolareChart').getContext('2d');
const ctxAccelerazione = document.getElementById('accelerazioneAngolareChart').getContext('2d');
const ctxJerk = document.getElementById('jerkChart').getContext('2d');

// Dati iniziali 
let time = 0;
const timeStep = 0.1; // secondi
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

// Creazione dei grafici secondari
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
async function readDataFromArduino() {
    const textDecoder = new TextDecoder();
    let buffer = ''; // Buffer to store partial data chunks

    while (communicationActive) {
        try {
            const { value, done } = await reader.read();
            if (done) {
                console.log("Stream finished.");
                break;
            }
            // Decode the data and add it to the buffer
            buffer += textDecoder.decode(value, { stream: true });

            // Check for newline characters to process each complete line of data
            let lines = buffer.split('\n');
            buffer = lines.pop(); // Save the last, potentially incomplete line back to the buffer

            for (let line of lines) {
                line = line.trim(); // Remove any extra whitespace
                if (line) {
                    processArduinoData(line);
                }
            }
        } catch (error) {
            console.error("Error reading from Arduino:", error);
            break; // Exit loop on error
        }
    }
}

function processArduinoData(data) {
    try {
        // Expect data in the format "2.00,-1.00,1.00,-5.00"
        const values = data.split(',');
        console.log(values);
        
        // Convert to floats and assign
        const posizione = parseFloat(values[0]);
        const velocita = parseFloat(values[1]);
        const accelerazione = parseFloat(values[2]);
        const jerk = parseFloat(values[3]);

        // Log the received data
        updateCharts(posizione, velocita, accelerazione, jerk);
    } catch (err) {
        console.warn("Data format error:", data);
    }
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
function updateCharts(p, v, a, j) {
    // Aggiorna il tempo
    time += timeStep;

    // Limita il numero di punti dati nel grafico
    if (posizioneData.length >= maxDataPoints) {
        posizioneData.shift();
        velocitaData.shift();
        accelerazioneData.shift();
        jerkData.shift();
        timeLabels.shift();
    }

    // Aggiungi i nuovi dati
    posizioneData.push(p.toFixed(3));
    velocitaData.push((v).toFixed(3));
    accelerazioneData.push(a.toFixed(3));
    jerkData.push(j.toFixed(3));
    timeLabels.push(time.toFixed(1));

    // Aggiorna i grafici secondari
    posizioneChart.update();
    velocitaChart.update();
    accelerazioneChart.update();
    jerkChart.update();
}
