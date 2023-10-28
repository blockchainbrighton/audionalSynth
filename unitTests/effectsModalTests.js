// effectsModalTests.js


function testToggleEffectsModal() {
    const modal = document.getElementById("effectsModal");
    const initialDisplay = modal.style.display;

    toggleEffectsModal(); // Function from effectsModal.js
    const newDisplay = modal.style.display;

    console.assert(initialDisplay !== newDisplay, 'toggleEffectsModal should show/hide the effects modal');
}

function testToggleEffect() {
    const dummyButton = document.createElement('button');
    dummyButton.classList.add('effect-on'); // Simulate an effect being on
    const effectName = 'Reverb';

    toggleEffect(dummyButton, effectName); // Function from effectsModal.js
    const isEffectOn = dummyButton.classList.contains('effect-on');

    console.assert(!isEffectOn, 'toggleEffect should toggle the effect off');
}
