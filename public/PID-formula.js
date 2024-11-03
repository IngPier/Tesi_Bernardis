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

function displayFormula() {
    // Retrieve values from input fields
    const kp = parseFloat(document.getElementById("kp").value);
    const ki = parseFloat(document.getElementById("ki").value);
    const kd = parseFloat(document.getElementById("kd").value);

    // Create the formula for each term based on non-zero values
    const terms = [];

    if (kp !== 0) {
        const kpTerm = (kp === 1 ? "\\epsilon(t)" : `${decimalToLatexFraction(kp)} \\epsilon(t)`);
        terms.push(kpTerm);
    }

    if (ki !== 0) {
        const kiTerm = (ki === 1 ? "\\int \\epsilon(t) dt" : `${decimalToLatexFraction(ki)} \\int \\epsilon(t) dt`);
        terms.push(kiTerm);
    }

    if (kd !== 0) {
        const kdTerm = (kd === 1 ? "\\frac{d}{dt} \\epsilon(t)" : `${decimalToLatexFraction(kd)} \\frac{d}{dt} \\epsilon(t)`);
        terms.push(kdTerm);
    }

    // Join the terms with appropriate signs
    let formula = "";
    for (const term of terms) {
        if (formula === "") {
            formula += term; // Start the formula with the first term
        } else {
            // Check if the current term is negative to determine how to join
            if (term.startsWith('-')) {
                formula += ` ${term}`; // Directly add negative terms
            } else {
                formula += ` + ${term}`; // Add positive terms with a plus sign
            }
        }
    }

    // Use "0" if all terms are zero
    if (formula === "") {
        formula = "0";
    }

    // Set the HTML content for the result
    document.getElementById("pid-formula").innerHTML = "$$U(t) = " + formula + "$$";

    // Call MathJax to render the added content
    MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
}
