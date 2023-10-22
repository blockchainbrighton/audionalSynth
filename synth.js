// synth.js

// Create an audio context
let context = new (window.AudioContext || window.webkitAudioContext)();
let currentOscillator = null;

function playMS10TriangleBass(e = null) {
    // Stop the current oscillator if it's playing
    if (currentOscillator) {
        currentOscillator.stop();
        currentOscillator = null;
    }

    // Create a new oscillator, gain, and filter
    let oscillator = context.createOscillator();
    let gainNode = context.createGain();
    let filter = context.createBiquadFilter();

    // Get the waveform value from the dropdown
    let waveform = document.getElementById("waveform").value;
    oscillator.type = waveform;

    // If no frequency is provided, get it from the note dropdown
    if (e === null) {
        e = parseFloat(document.getElementById("note").value);
    }

    // Check if the frequency value is valid
    if (!isFinite(e)) {
        console.error("Invalid frequency value:", e);
        return;
    }

    // Set the oscillator frequency
    oscillator.frequency.setValueAtTime(e, context.currentTime);

    // Get attack and release values from the range inputs
    let attack = document.getElementById("attack").value / 1000;
    let release = document.getElementById("release").value / 1000;

    // Get cutoff and resonance values from the range inputs
    let cutoff = document.getElementById("cutoff").value;
    let resonance = document.getElementById("resonance").value;

    // Configure the filter
    filter.type = "lowpass";
    filter.frequency.value = cutoff;
    filter.Q.value = resonance;

    // Set the initial gain value to 0
    gainNode.gain.setValueAtTime(0, context.currentTime);

    // Get the volume value
    const volume = getVolume();

    // Configure the gain node to ramp up and down based on attack and release
    gainNode.gain.linearRampToValueAtTime(2 * volume, context.currentTime + attack);
    gainNode.gain.linearRampToValueAtTime(0, context.currentTime + attack + release);

    // Connect the oscillator to the filter, then to the gain node, and finally to the destination
    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(context.destination);

    // Start the oscillator and set it to stop after the release time
    oscillator.start();
    oscillator.stop(context.currentTime + attack + release);

    // Set the current oscillator to the newly created oscillator
    currentOscillator = oscillator;
}

let nextNoteTime = context.currentTime;
