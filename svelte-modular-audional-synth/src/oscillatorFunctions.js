// oscillatorFunctions.js
// Global variable to keep track of the current playing oscillator
let currentOscillator;

export function playNote(note, velocity, audioContext, gainNode, midiNoteToFrequency) {
    let waveform = 'sine';
    let attack = 0.1;
    let decay = 0.1;
    let sustain = 0.7;
    let release = 0.5;

    if (!audioContext) return;

    currentOscillator = audioContext.createOscillator();
    currentOscillator.type = waveform;
    currentOscillator.frequency.value = midiNoteToFrequency(note);
    currentOscillator.connect(gainNode);
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(velocity / 127, audioContext.currentTime + attack);
    gainNode.gain.linearRampToValueAtTime(sustain, audioContext.currentTime + attack + decay);
    currentOscillator.start();
}

export function stopNote(note, audioContext, gainNode) {
    let release = 0.5;

    if (currentOscillator) {
        gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + release);
        currentOscillator.stop(audioContext.currentTime + release);
        currentOscillator.disconnect();
        currentOscillator = null; // Reset the currentOscillator to null after stopping it
    }
}