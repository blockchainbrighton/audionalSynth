// oscillatorFunctions.js

export function createOscillator(audioContext, gainNode, { waveform, attack, decay, sustain, release }) {
    let oscillator;

    function play(note, velocity, midiNoteToFrequency) {
        console.log(`play: Received note: ${note}, velocity: ${velocity}`);
        if (!audioContext) {
            console.log(`play: Audio context is not available`);
            return;
        }
    
        oscillator = audioContext.createOscillator();
        console.log(`play: Oscillator created`);
        oscillator.type = waveform;
        console.log(`play: Oscillator type set to ${waveform}`);
        oscillator.frequency.value = midiNoteToFrequency(note);
        console.log(`play: Oscillator frequency set to ${midiNoteToFrequency(note)} Hz`);
        oscillator.connect(gainNode);
        console.log(`play: Oscillator connected to gain node`);
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(velocity / 127, audioContext.currentTime + attack);
        console.log(`play: Gain node attack time set to ${attack}`);
        gainNode.gain.linearRampToValueAtTime(sustain, audioContext.currentTime + attack + decay);
        console.log(`play: Gain node decay time set to ${decay}, sustain level set to ${sustain}`);
        oscillator.start();
        console.log(`play: Oscillator started`);
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
