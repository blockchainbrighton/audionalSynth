<!-- App.svelte -->

<script>
    import Piano from './Piano.svelte';
    import MidiController from './MidiController.svelte';
    import { midiData } from './midiStore.js';
    import Oscillator from './Oscillator.svelte';
    import { runMidiTest } from './midiTest.js';

    let audioContext = null;
    let gainNode = null;

    function initAudio() {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        console.log('App: Audio context created', audioContext);

        gainNode = audioContext.createGain();
        console.log('App: Gain node created', gainNode);

        gainNode.connect(audioContext.destination);
        console.log('App: Gain node connected to audio context destination');

        audioContext.resume().then(() => {
            console.log('App: Audio context resumed');
        }).catch(err => {
            console.error('App: Error resuming audio context', err);
        });
    }

    let midiMessage;
    midiData.subscribe(value => {
        midiMessage = value;
        console.log('App: midiData subscription callback, received value:', value);
    });
</script>

<main>
    <h1>Audional Synth - Basic 88 note Keyboard</h1>
    <button on:click={initAudio}>Initialize Audio</button>
    <button on:click={runMidiTest}>Run MIDI Test</button>
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
