<!-- Oscillator.svelte -->

<script>
    import { midiData } from './midiStore.js';
    import { handlePlayNote, handleStopNote } from './oscillatorFunctions.js';
    import { midiNoteToFrequency } from './midiNotesToFrequencies.js';

    export let audioContext;
    export let gainNode;
    export let midiMessage;

    let waveform = 'sine'; // Default waveform
    let attack = 0.1; // Attack time in seconds
    let decay = 0.1; // Decay time in seconds
    let sustain = 0.8; // Sustain level (0 to 1)
    let release = 0.1; // Release time in seconds

    // Here, we are using the midiData to trigger the oscillator
    $: if (midiMessage) {
        console.log(`Oscillator: midiMessage is truthy, handling MIDI data: ${JSON.stringify(midiMessage)}`);
        if (midiMessage.type === 'noteOn') {
            console.log(`Oscillator: Handling noteOn event for note: ${midiMessage.note} with velocity: ${midiMessage.velocity}`);
            handlePlayNote(audioContext, gainNode, midiMessage.note, midiMessage.velocity, { waveform, attack, decay, sustain, release }, midiNoteToFrequency);
        } else if (midiMessage.type === 'noteOff') {
            console.log(`Oscillator: Handling noteOff event for note: ${midiMessage.note}`);
            handleStopNote(midiMessage.note);
        } else {
            console.log(`Oscillator: Unhandled MIDI message type: ${midiMessage.type}`);
        }
    }
</script>



<div class="oscillator-controls">
    <label>
        Waveform:
        <select bind:value={waveform}>
            <option value="sine">Sine</option>
            <option value="square">Square</option>
            <option value="sawtooth">Sawtooth</option>
            <option value="triangle">Triangle</option>
        </select>
    </label>
    <label>
        Attack:
        <input type="range" min="0" max="1" step="0.01" bind:value={attack} />
    </label>
    <label>
        Decay:
        <input type="range" min="0" max="1" step="0.01" bind:value={decay} />
    </label>
    <label>
        Sustain:
        <input type="range" min="0" max="1" step="0.01" bind:value={sustain} />
    </label>
    <label>
        Release:
        <input type="range" min="0" max="1" step="0.01" bind:value={release} />
    </label>
</div>

<style>
  
</style>
