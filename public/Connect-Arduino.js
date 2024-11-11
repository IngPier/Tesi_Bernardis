let port;
let writer;
let reader;
let isConnected = false;
let communicationActive = false; // New variable to manage communication

// Function to connect to Arduino
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

// Function to disconnect from Arduino
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

// Function to start communication with Arduino
async function startCommunication() {
    if (!isConnected || communicationActive) {
        console.warn("Cannot start communication. Check connection status.");
        return;
    }

    communicationActive = true;
    document.getElementById("start-communication-btn").disabled = true; // Disable "Start Communication" button
    document.getElementById("stop-communication-btn").disabled = false; // Enable "Stop Communication" button
    document.getElementById("clear-charts-btn").disabled = true; // Disable "Clear Charts" button

    console.log("Communication started with Arduino.");

    // Re-initialize the reader and writer if necessary
    if (!reader || !writer) {
        writer = port.writable.getWriter();
        reader = port.readable.getReader();
    }

    // Start reading data from Arduino
    readDataFromArduino();
}

// Function to stop communication with Arduino
async function stopCommunication() {
    if (!communicationActive) {
        console.warn("Communication is not active.");
        return;
    }

    communicationActive = false;
    document.getElementById("start-communication-btn").disabled = false; // Enable "Start Communication" button
    document.getElementById("stop-communication-btn").disabled = true; // Disable "Stop Communication"
    document.getElementById("clear-charts-btn").disabled = false; // Enable "Clear Charts" button

    console.log("Communication stopped with Arduino.");

    // Optionally, you can close the reader here if desired
    await reader.cancel();
    writer.releaseLock();

    // Nullify the reader and writer to ensure they are reinitialized when communication starts again
    reader = null;
    writer = null;
}

// Function to read data from Arduino
async function readDataFromArduino() {
    try {
        const { value, done } = await reader.read();

        if (done) {
            console.log("Reader closed.");
            return;
        }

        // Process the data here
        console.log("Data received:", value);

        // Continue reading if communication is still active
        if (communicationActive) {
            readDataFromArduino();
        }
    } catch (err) {
        console.error("Error reading from Arduino:", err);
    }
}
