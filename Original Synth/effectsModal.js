// effectsModal.js


function toggleEffectsModal() {
    var modal = document.getElementById("effectsModal");
    var toggleButton = document.getElementById("toggleEffectsButton");
    if (modal.style.display === "none") {
        modal.style.display = "block";
        toggleButton.textContent = "Hide Effects";
    } else {
        modal.style.display = "none";
        toggleButton.textContent = "Show Effects";
    }
}

function toggleEffect(button, effectName) {
    if (button.classList.contains('effect-on')) {
        button.classList.remove('effect-on');
        button.textContent = `${effectName} Off`;
        // Additional logic to turn off the effect
    } else {
        button.classList.add('effect-on');
        button.textContent = `${effectName} On`;
        // Additional logic to turn on the effect
    }
}
