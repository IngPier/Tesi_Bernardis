let port;
let writer;
let reader;
let isConnected = false;
let communicationActive = false; // New variable to manage communication

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
        document.getElementById("start-communication-btn").disabled = false; // Enable "Start Communication" button
        document.getElementById("stop-communication-btn").disabled = true; // Disable "Stop Communication" button
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
        document.getElementById("start-communication-btn").disabled = true; // Disable "Start Communication" button
        document.getElementById("stop-communication-btn").disabled = true; // Disable "Stop Communication" button
        console.log("Arduino disconnected");
    }
}

async function startCommunication() {
    if (!isConnected || communicationActive) {
        console.warn("Cannot start communication. Check connection status.");
        return;
    }

    communicationActive = true;
    document.getElementById("start-communication-btn").disabled = true; // Disable "Start Communication" button
    document.getElementById("stop-communication-btn").disabled = false; // Enable "Stop Communication" button
    document.getElementById("clear-charts-btn").disabled = true; // Enable "Stop Communication" button

    console.log("Communication started with Arduino.");

    // Start reading data from Arduino
    readDataFromArduino();
}



async function stopCommunication() {
    if (!communicationActive) {
        console.warn("Communication is not active.");
        return;
    }

    communicationActive = false;
    document.getElementById("start-communication-btn").disabled = false; // Enable "Start Communication" button
    document.getElementById("stop-communication-btn").disabled = true; // Disable "Stop Communication"
    document.getElementById("clear-charts-btn").disabled = false; // Enable "Stop Communication" button

    console.log("Communication stopped with Arduino.");

    // Optionally, you can close the reader here if desired
    await reader.cancel();
    writer.releaseLock();
}
