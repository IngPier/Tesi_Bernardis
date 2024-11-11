let confirmedParams = {
    kp: 0,
    ki: 0,
    kd: 0
};

function decimalToLatexFraction(decimal) {
    const precision = 10000; // Precision for fraction conversion
    const isNegative = decimal < 0; // Check if the number is negative
    const num = Math.abs(Math.round(decimal * precision)); // Calculate numerator
    const denom = precision; // Fixed denominator

    // Function to calculate the greatest common divisor (GCD)
    const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
    const divisor = gcd(num, denom); // Find the GCD

    // If the denominator is 1, return only the numerator
    if (denom / divisor === 1) {
        return `${isNegative ? '-' : ''}${num / divisor}`;
    }

    // Return the fraction in LaTeX format, with the negative sign outside the fraction
    return `${isNegative ? '-' : ''}\\frac{${num / divisor}}{${denom / divisor}}`;
}

function setParameter(param) {
    const value = parseFloat(document.getElementById(param).value);

    // Set the temporary value in confirmedParams, but don't confirm it yet
    confirmedParams[param] = value;

    // Cambia il testo a fianco al pulsante "Set" per mostrare "Valore da confermare"
    const statusElement = document.getElementById(`${param}-status`);
    statusElement.innerHTML = `Da confermare: <span id="current-${param}">${value.toFixed(3)}</span>`;

    // Aggiungi il bordo rosso e la classe per evidenziare il valore da confermare
    statusElement.classList.add('confirmation-pending');
}

function displayFormula() {
    // Quando si clicca "Mostra Formula PID", i valori temporanei sono confermati
    const kp = confirmedParams.kp;
    const ki = confirmedParams.ki;
    const kd = confirmedParams.kd;

    // Aggiorniamo i testi a fianco di ogni parametro per indicare "Attuale" e rimuoviamo la classe
    document.getElementById("kp-status").innerHTML = `Attuale: <span id="current-kp">${kp.toFixed(3)}</span>`;
    document.getElementById("ki-status").innerHTML = `Attuale: <span id="current-ki">${ki.toFixed(3)}</span>`;
    document.getElementById("kd-status").innerHTML = `Attuale: <span id="current-kd">${kd.toFixed(3)}</span>`;

    // Rimuoviamo la classe di conferma per tutti i parametri
    document.getElementById("kp-status").classList.remove('confirmation-pending');
    document.getElementById("ki-status").classList.remove('confirmation-pending');
    document.getElementById("kd-status").classList.remove('confirmation-pending');

    // Creiamo la formula per ogni termine basato sui valori non zero
    const terms = [];

    if (kp !== 0) {
        const kpTerm = (kp === 1 ? "e(t)" : `${decimalToLatexFraction(kp)} e(t)`);
        terms.push(kpTerm);
    }

    if (ki !== 0) {
        const kiTerm = (ki === 1 ? "\\int_0^t e(\\tau) d\\tau" : `${decimalToLatexFraction(ki)} \\int_0^t e(\\tau) d\\tau`);
        terms.push(kiTerm);
    }

    if (kd !== 0) {
        const kdTerm = (kd === 1 ? "\\frac{d}{dt} e(t)" : `${decimalToLatexFraction(kd)} \\frac{d}{dt} e(t)`);
        terms.push(kdTerm);
    }

    // Uniamo i termini con i segni appropriati
    let formula = "";
    for (const term of terms) {
        if (formula === "") {
            formula += term; // Inizia la formula con il primo termine
        } else {
            // Verifica se il termine corrente è negativo per determinare come unire
            if (term.startsWith('-')) {
                formula += ` ${term}`; // Aggiungi i termini negativi direttamente
            } else {
                formula += ` + ${term}`; // Aggiungi i termini positivi con il segno "+"
            }
        }
    }

    // Usa "0" se tutti i termini sono zero
    if (formula === "") {
        formula = "0";
    }

    // Impostiamo il contenuto HTML per il risultato
    document.getElementById("pid-formula").innerHTML = "$$u(t) = " + formula + "$$";

    // Chiama MathJax per renderizzare il contenuto aggiunto
    MathJax.Hub.Queue(["Typeset", MathJax.Hub]);

    sendParamsToArduino(kp, ki, kd);
}


function sendParamsToArduino(kp, ki, kd) {
    if (isConnected && communicationActive) {
        // Prepara i dati come stringa
        const params = `${kp.toFixed(3)}, ${ki.toFixed(3)}, ${kd.toFixed(3)}\n`;
        
        // Invia i dati ad Arduino tramite la connessione seriale
        writer.write(new TextEncoder().encode(params));
        console.log(`Parametri inviati a Arduino: ${params}`);
    } else {
        console.warn("Non connesso ad Arduino o comunicazione non attiva.");
    }
} 