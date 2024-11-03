let port;
let writer;
let reader;
let isConnected = false;
let communicationActive = false; // Nuova variabile per gestire la comunicazione

async function connectArduino() {
    if (isConnected) {
        console.warn("Already connected to Arduino.");
        return;
    }

    try {
        port = await navigator.serial.requestPort();
        await port.open({ baudRate: 115200 });
        writer = port.writable.getWriter();
        reader = port.readable.getReader();
        isConnected = true;
        document.getElementById("status-text").textContent = "Connected";
        document.getElementById("status-text").style.color = "green";
        document.getElementById("start-communication-btn").disabled = false; // Abilita il pulsante "Inizia Comunicazione"
        document.getElementById("stop-communication-btn").disabled = true; // Disabilita il pulsante "Termina Comunicazione"
        console.log("Arduino connected");
    } catch (err) {
        console.error("Connection failed:", err);
    }
}

async function disconnectArduino() {
    if (port && isConnected) {
        await reader.cancel();
        writer.releaseLock();
        await port.close();
        isConnected = false;
        document.getElementById("status-text").textContent = "Not Connected";
        document.getElementById("status-text").style.color = "red";
        document.getElementById("start-communication-btn").disabled = true; // Disabilita il pulsante "Inizia Comunicazione"
        document.getElementById("stop-communication-btn").disabled = true; // Disabilita il pulsante "Termina Comunicazione"
        console.log("Arduino disconnected");
    }
}

async function startCommunication() {
    if (!isConnected || communicationActive) {
        console.warn("Cannot start communication. Check connection status.");
        return;
    }

    communicationActive = true;
    document.getElementById("start-communication-btn").disabled = true; // Disabilita il pulsante "Inizia Comunicazione"
    document.getElementById("stop-communication-btn").disabled = false; // Abilita il pulsante "Termina Comunicazione"

    // Logica per iniziare a leggere i dati da Arduino
    console.log("Communication started with Arduino.");
    // Includi qui la logica per iniziare a leggere i dati.
}

async function stopCommunication() {
    if (!communicationActive) {
        console.warn("Communication is not active.");
        return;
    }

    communicationActive = false;
    document.getElementById("start-communication-btn").disabled = false; // Abilita il pulsante "Inizia Comunicazione"
    document.getElementById("stop-communication-btn").disabled = true; // Disabilita il pulsante "Termina Comunicazione"

    // Logica per fermare la lettura dei dati da Arduino
    console.log("Communication stopped with Arduino.");
    // Includi qui la logica per fermare la lettura dei dati.
}
