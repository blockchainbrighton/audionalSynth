// oscillatorFunctions.js

export function createOscillator(audioContext, gainNode, { waveform, attack, decay, sustain, release }) {
    let oscillator;

    function play(note, velocity, midiNoteToFrequency) {
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

    function stop() {
        if (oscillator) {
            gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + release);
            oscillator.stop(audioContext.currentTime + release);
            oscillator.disconnect();
        }
    }

    return { play, stop };
}
