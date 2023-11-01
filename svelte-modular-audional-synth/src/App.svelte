<!-- App.svelte -->

<script>

    import Piano from './Piano.svelte';
    import MidiController from './MidiController.svelte';
    import { midiData } from './midiStore.js'; // Import the midiData store
    import Oscillator from './Oscillator.svelte';

    let audioContext = null;
    let gainNode = null;

    function runMidiTest() {
        // Test MIDI Note On
        simulateMIDIMessage('noteOn', 60, 100); // Play middle C with velocity 100

        // Wait for 2 seconds and then stop the note
        setTimeout(() => {
            simulateMIDIMessage('noteOff', 60, 0);
        }, 2000);
    }

    function initAudio() {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        console.log('App: Audio context created', audioContext);

        gainNode = audioContext.createGain();
        console.log('App: Gain node created', gainNode);

        gainNode.connect(audioContext.destination);
        console.log('App: Gain node connected to audio context destination');

        // Optional: Resume audio context in case it's suspended
        audioContext.resume().then(() => {
            console.log('App: Audio context resumed');
        }).catch(err => {
            console.error('App: Error resuming audio context', err);
        });
    }

    // Subscribe to the midiData store
    let midiMessage;
    midiData.subscribe(value => {
        midiMessage = value;
        console.log('App: midiData subscription callback, received value:', value);
    });

    // Expose the test function to the global scope
    window.runMidiTest = runMidiTest;
</script>

<main>
    <h1>Audional Synth - Basic 88 note Keyboard</h1>
    <button on:click={initAudio}>Initialize Audio</button>
    <button on:click={runMidiTest}>Run MIDI Test</button> <!-- Add this button -->
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