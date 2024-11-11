// Dichiarazione dei pin e delle variabili
const int potPin = A0; // Pin a cui è collegato il potenziometro
const float timeStep = 0.1; // Passo temporale in secondi
float posizione = 0; // Posizione angolare corrente
float velocita = 0; // Velocità angolare
float accelerazione = 0; // Accelerazione angolare
float jerk = 0; // Jerk angolare
float lastPosizione = 0; // Posizione angolare precedente
float lastVelocita = 0; // Velocità angolare precedente
float lastAccelerazione = 0; // Accelerazione angolare precedente
unsigned long previousMillis = 0; // Tempo precedente per il controllo della frequenza di invio

// Parametri PID
float kp = 0;
float ki = 0;
float kd = 0;

// Struttura per restituire i parametri PID
struct PID_Params {
  float kp;
  float ki;
  float kd;
};

void setup() {
    Serial.begin(115200); // Inizializza la comunicazione seriale
}

void loop() {
    unsigned long currentMillis = millis(); // Ottiene il tempo corrente

    // Controlla se è trascorso il tempo per inviare i dati
    if (currentMillis - previousMillis >= 100) { // Invia dati ogni 100 ms
        previousMillis = currentMillis; // Aggiorna il tempo precedente

        // Legge il valore dal potenziometro (0-1023) e lo mappa in un range di 0-360°
        int potValue = analogRead(potPin);
        posizione = map(potValue, 0, 1023, 0, 360); // Mappa il valore in gradi

        // Calcola la velocità (differenza di posizione nel tempo)
        velocita = (posizione - lastPosizione) / timeStep;
        lastPosizione = posizione; // Salva l'ultima posizione

        // Calcola l'accelerazione (differenza di velocità nel tempo)
        accelerazione = (velocita - lastVelocita) / timeStep;
        lastVelocita = velocita; // Salva l'ultima velocità

        // Calcola il jerk (differenza di accelerazione nel tempo)
        jerk = (accelerazione - lastAccelerazione) / timeStep;
        lastAccelerazione = accelerazione; // Salva l'ultima accelerazione

        // Legge i valori PID dalla seriale (se disponibili)
        if (Serial.available() > 0) {
            // Leggi i dati dalla seriale
            String input = Serial.readStringUntil('\n');  // Leggi una riga intera
            PID_Params pid = parsePID(input);  // Funzione per analizzare i dati PID

            // Usa i valori PID restituiti
            kp = pid.kp;
            ki = pid.ki;
            kd = pid.kd;
        }

        // Moltiplica la velocità, accelerazione e jerk per i rispettivi Kp, Ki, Kd
        velocita *= kp;
        accelerazione *= ki;
        jerk *= kd;

        // Invia i dati sulla porta seriale (posizione, velocità, accelerazione, jerk)
        String dataToSend = String(posizione, 3) + "," + String(velocita, 3) + "," + String(accelerazione, 3) + "," + String(jerk, 3);
        Serial.println(dataToSend);  // Invia la stringa formattata
    }
}

// Funzione per analizzare i dati PID ricevuti e restituire una struttura
PID_Params parsePID(String input) {
    PID_Params pidParams = {0, 0, 0}; // Inizializza la struttura con valori di default

    // Controlla se l'input è valido
    int firstComma = input.indexOf(',');
    int secondComma = input.indexOf(',', firstComma + 1);

    if (firstComma > 0 && secondComma > 0) {
        // Estrai i valori Kp, Ki, Kd
        String kpStr = input.substring(0, firstComma);
        String kiStr = input.substring(firstComma + 1, secondComma);
        String kdStr = input.substring(secondComma + 1);

        // Converti le stringhe in numeri float
        pidParams.kp = kpStr.toFloat();
        pidParams.ki = kiStr.toFloat();
        pidParams.kd = kdStr.toFloat();

        // Stampa i valori per verificare
        Serial.print("Kp: ");
        Serial.print(pidParams.kp);
        Serial.print(" Ki: ");
        Serial.print(pidParams.ki);
        Serial.print(" Kd: ");
        Serial.println(pidParams.kd);
    } else {
        Serial.println("Dati PID non validi!");
    }

    return pidParams;  // Restituisci la struttura con i valori PID
}
