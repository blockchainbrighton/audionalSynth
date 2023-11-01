<script>
    import Piano from './Piano.svelte';
    import MidiController from './MidiController.svelte';
    import { midiNoteToFrequency } from './utils.js';
    import Oscillator from './Oscillator.svelte';


    let audioContext = null;
    let gainNode = null;

    function initAudio() {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        gainNode = audioContext.createGain();
    }
</script>

<main>
    <h1>Audional Synth - Basic 88 note Keyboard</h1>
    <button on:click={initAudio}>Initialize Audio</button>
    {#if audioContext && gainNode}
        <Piano audioContext={audioContext} gainNode={gainNode} midiNoteToFrequency={midiNoteToFrequency} />
        <MidiController />
        <Oscillator audioContext={audioContext} gainNode={gainNode} midiNoteToFrequency={midiNoteToFrequency} />
    {/if}
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
