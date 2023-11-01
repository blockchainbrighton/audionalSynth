// oscillatorFunctions.js

let oscillatorInstances = {};

export function createOscillator(audioContext, gainNode, { waveform, attack, decay, sustain, release }) {
    let oscillator;

    console.log(`createOscillator: Creating oscillator with waveform: ${waveform}, attack: ${attack}, decay: ${decay}, sustain: ${sustain}, release: ${release}`);


    function play(frequency, velocity) {
        console.log(`createOscillator: play function called with frequency: ${frequency}, velocity: ${velocity}`);
        if (!audioContext) {
            console.log(`play: Audio context is not available`);
            return;
        }
    
        oscillator = audioContext.createOscillator();
        console.log(`play: Oscillator created`);
        oscillator.type = waveform;
        console.log(`play: Oscillator type set to ${waveform}`);
        oscillator.frequency.value = frequency;
        console.log(`play: Oscillator frequency set to ${frequency} Hz`);
        oscillator.connect(gainNode);
        console.log(`play: Oscillator connected to gain node`);
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(velocity / 127, audioContext.currentTime + attack);
        console.log(`play: Gain node attack time set to ${attack}`);
        gainNode.gain.linearRampToValueAtTime(sustain, audioContext.currentTime + attack + decay);
        console.log(`play: Gain node decay time set to ${decay}, sustain level set to ${sustain}`);
        oscillator.start();
        console.log(`play: Oscillator started`);
        console.log(`play: Oscillator play function execution complete`);
    }

    function stop() {
        console.log(`createOscillator: stop function called`);
        if (oscillator) {
            gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + release);
            oscillator.stop(audioContext.currentTime + release);
            oscillator.disconnect();
            console.log(`stop: Oscillator stopped`);
        }
    }

    return { play, stop };
}

export function handlePlayNote(audioContext, gainNode, note, velocity, settings, midiNoteToFrequency) {
    console.log('handlePlayNote: Starting to play note', note, 'with velocity', velocity);
    const frequency = midiNoteToFrequency(note); // Convert MIDI note to frequency
    console.log(`handlePlayNote: Converted frequency: ${frequency} Hz`);
    if (!oscillatorInstances[note]) {
        oscillatorInstances[note] = createOscillator(audioContext, gainNode, settings);
        console.log(`handlePlayNote: Oscillator instance created for note: ${note}`);
    }
    oscillatorInstances[note].play(frequency, velocity); // Use frequency instead of MIDI note
    console.log(`handlePlayNote: Playing note with frequency: ${frequency} Hz and velocity: ${velocity}`);
}

export function handleStopNote(note) {
    console.log(`handleStopNote: Called`);
    if (oscillatorInstances[note]) {
        oscillatorInstances[note].stop();
        delete oscillatorInstances[note];
        console.log(`handleStopNote: Stopped note: ${note}`);
    }
}

