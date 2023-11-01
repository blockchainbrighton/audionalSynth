<script>
    import Piano from './Piano.svelte';
    import MidiController from './MidiController.svelte';
    import Oscillator from './Oscillator.svelte'; // Import Oscillator
    import { midiNoteToFrequency } from './utils.js'; // Import the function

    // Create an audio context
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();

    // Create a gain node
    const gainNode = audioContext.createGain();
</script>

<main>
    <h1>Audional Synth - Basic 88 note Keyboard</h1>
    <Piano />
    <MidiController />
    <Oscillator {audioContext} {gainNode} {midiNoteToFrequency} /> <!-- Include Oscillator component and pass the function as a prop -->
</main>

<style>
    main {
        text-align: center;
        padding: 1em;
        margin: 0 auto;
    }

    h1 {
        color: #ff3e00;
        text-transform: uppercase;
        font-size: 2em;
        font-weight: 100;
    }
</style>
