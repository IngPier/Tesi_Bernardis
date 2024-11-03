// Dichiarazione dei pin e delle variabili
const int potPin = A0; // Pin a cui è collegato il potenziometro
const float timeStep = 0.1; // Passo temporale in secondi
float posizione = 0; // Posizione angolare corrente
float lastPosizione = 0; // Ultima posizione angolare letta
float velocita = 0; // Velocità angolare
float accelerazione = 0; // Accelerazione angolare
float jerk = 0; // Jerk angolare

void setup() {
    Serial.begin(9600); // Inizializza la comunicazione seriale
}

void loop() {

    float lastPosizione = posizione;
    float lastVelocita = velocita;
    float lastAccelerazione = accelerazione;
    // Legge il valore dal potenziometro (0-1023) e lo mappa in un range di 0-360°
    int potValue = analogRead(potPin);
    posizione = map(potValue, 0, 1023, 0, 360); // Mappa il valore in gradi

    // Calcola la velocità (differenza di posizione nel tempo)
    velocita = (posizione - lastPosizione) / timeStep;

    // Calcola l'accelerazione (differenza di velocità nel tempo)
    accelerazione = (velocita - lastVelocita) / timeStep;

    // Calcola il jerk (differenza di accelerazione nel tempo)
    jerk = (accelerazione - lastAccelerazione) / timeStep;

    // Invia i dati sulla porta seriale
    Serial.print(posizione);
    Serial.print(",");
    Serial.print(velocita);
    Serial.print(",");
    Serial.print(accelerazione);
    Serial.print(",");
    Serial.println(jerk);

    // Aggiorna le variabili per il prossimo ciclo


    // Aspetta 100 ms prima di ripetere il ciclo
    delay(100);
}
