// Dichiarazione dei pin e delle variabili
const int potPin = A0; // Pin a cui è collegato il potenziometro
const float timeStep = 0.1; // Passo temporale in secondi
float posizione = 0; // Posizione angolare corrente
float velocita = 0; // Velocità angolare
float accelerazione = 0; // Accelerazione angolare
float jerk = 0; // Jerk angolare
float lastPosizione = 0; // Posizione angolare corrente
float lastVelocita = 0; // Velocità angolare
float lastAccelerazione = 0; // Accelerazione angolare
unsigned long previousMillis = 0; // Tempo precedente per il controllo della frequenza di invio

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

        // Invia i dati sulla porta seriale
        Serial.print(posizione);
        Serial.print(",");
        Serial.print(velocita);
        Serial.print(",");
        Serial.print(accelerazione);
        Serial.print(",");
        Serial.println(jerk);
    }

}
