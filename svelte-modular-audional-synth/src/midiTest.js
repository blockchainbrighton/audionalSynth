// midiTest.js

import { midiData } from './midiStore.js';
import { handlePlayNote, handleStopNote } from './oscillatorFunctions.js';
import { midiNoteToFrequency } from './midiNotesToFrequencies.js';

// Initialize AudioContext and GainNode
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const gainNode = audioContext.createGain();

// Test settings for the oscillator
const testSettings = {
    waveform: 'sine',
    attack: 0.1,
    decay: 0.1,
    sustain: 0.7,
    release: 0.5
};

// Function to simulate MIDI message
function simulateMIDIMessage(type, note, velocity) {
    const midiMessage = { type, note, velocity };
    midiData.set(midiMessage); // Update the midiData store

    if (type === 'noteOn') {
        handlePlayNote(audioContext, gainNode, note, velocity, testSettings, midiNoteToFrequency);
    } else if (type === 'noteOff') {
        handleStopNote();
    }
}
// Export the test function
export function runMidiTest() {
    // Test MIDI Note On
    simulateMIDIMessage('noteOn', 60, 100); // Play middle C with velocity 100

    // Wait for 2 seconds and then stop the note
    setTimeout(() => {
        simulateMIDIMessage('noteOff', 60, 0);
    }, 2000);
}
