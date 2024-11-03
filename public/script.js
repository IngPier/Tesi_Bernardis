function toggleNightMode() {
    document.body.classList.toggle('bg-dark');
    document.body.classList.toggle('text-light');
}

function setParameter(param) {
    const value = document.getElementById(param).value;
    document.getElementById(`current-${param}`).textContent = parseFloat(value).toFixed(3);
}


