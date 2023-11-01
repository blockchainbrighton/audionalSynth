<script>
    import Piano from './Piano.svelte';
    import MidiController from './MidiController.svelte';
    import Oscillator from './Oscillator.svelte'; // Import Oscillator

    // Create an audio context
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();

    // Create a gain node
    const gainNode = audioContext.createGain();
</script>

<main>
    <h1>Audional Synth - Basic 88 note Keyboard</h1>
    <Piano />
    <MidiController />
    <Oscillator {audioContext} {gainNode} /> <!-- Include Oscillator component -->
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
