// audioTests.test.js

const { createOscillator, handlePlayNote, handleStopNote } = require('./oscillatorFunctions');
const { midiNoteToFrequency } = require('./midiNotesToFrequencies');

describe('Audio Unit Tests', () => {
    let audioContext;
    let gainNode;

    beforeAll(() => {
        // Initialize the AudioContext and GainNode before all tests
        audioContext = new AudioContext();
        gainNode = audioContext.createGain();
    });

    afterAll(() => {
        // Close the AudioContext after all tests
        audioContext.close();
    });

    test('AudioContext is initialized', () => {
        expect(audioContext).toBeDefined();
        expect(audioContext.state).toBe('running');
        console.log('[AudioContext is initialized Test Complete]');
    });

    test('GainNode is initialized', () => {
        expect(gainNode).toBeDefined();
        expect(gainNode.gain.value).toBe(0);
        console.log('[GainNode is initialized Test Complete]');
    });

    test('Create Oscillator', () => {
        const oscillator = createOscillator(audioContext, gainNode, { waveform: 'sine', attack: 0.1, decay: 0.1, sustain: 0.7, release: 0.5 });
        expect(oscillator).toBeDefined();
        console.log('[Create Oscillator Test Complete]');
    });

    test('Play Note', () => {
        const note = 60; // MIDI note
        const velocity = 100;
        handlePlayNote(note, velocity);
        // Add assertions to check if the oscillator is playing the correct frequency
        // and if the gain node is ramping up the volume
        console.log('[Play Note Test Complete]');
    });

    test('Stop Note', () => {
        const note = 60; // MIDI note
        handleStopNote(note);
        // Add assertions to check if the oscillator has stopped
        // and if the gain node is ramping down the volume
        console.log('[Stop Note Test Complete]');
    });

    test('Dispose Audio Resources', () => {
        // Test the disposal of audio resources
        // Add assertions to check if the resources are properly disposed of
        console.log('[Dispose Audio Resources Test Complete]');
    });

    // Add more tests as needed for other functionalities
});
