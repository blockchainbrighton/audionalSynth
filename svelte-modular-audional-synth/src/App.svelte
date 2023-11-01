<!-- App.svelte -->


<script>
    import Piano from './Piano.svelte';
    import MidiController from './MidiController.svelte';
    import { midiData } from './midiStore.js'; // Import the midiData store
    import Oscillator from './Oscillator.svelte';

    let audioContext = null;
    let gainNode = null;

    function initAudio() {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        gainNode = audioContext.createGain();
    }

    // Subscribe to the midiData store
    let midiMessage;
    midiData.subscribe(value => {
        midiMessage = value;
    });
</script>

<main>
    <h1>Audional Synth - Basic 88 note Keyboard</h1>
    <button on:click={initAudio}>Initialize Audio</button>
    {#if audioContext && gainNode}
        <Piano />
        <MidiController />
        <Oscillator audioContext={audioContext} gainNode={gainNode} midiData={midiMessage} />
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
