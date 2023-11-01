// oscillatorFunctions.js
export function playNote(note, velocity, audioContext, gainNode, midiNoteToFrequency) {
    let oscillator;
    let waveform = 'sine';
    let attack = 0.1;
    let decay = 0.1;
    let sustain = 0.7;
    let release = 0.5;

    if (!audioContext) return;

    oscillator = audioContext.createOscillator();
    oscillator.type = waveform;
    oscillator.frequency.value = midiNoteToFrequency(note);
    oscillator.connect(gainNode);
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(velocity / 127, audioContext.currentTime + attack);
    gainNode.gain.linearRampToValueAtTime(sustain, audioContext.currentTime + attack + decay);
    oscillator.start();
}

export function stopNote(note, audioContext, gainNode) {
    let oscillator;
    let release = 0.5;

    if (oscillator) {
        gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + release);
        oscillator.stop(audioContext.currentTime + release);
        oscillator.disconnect();
    }
}
