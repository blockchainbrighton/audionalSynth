<!-- Oscillator.svelte -->


<script>
    import { createOscillator } from './oscillatorFunctions.js';

    export let audioContext;
    export let gainNode;

    let waveform = 'sine';
    let attack = 0.1;
    let decay = 0.1;
    let sustain = 0.7;
    let release = 0.5;
    let oscillatorInstance;

    export function handlePlayNote(note, velocity, audioContext, gainNode, midiNoteToFrequency) {
        oscillatorInstance = createOscillator(audioContext, gainNode, { waveform, attack, decay, sustain, release });
        oscillatorInstance.play(note, velocity, midiNoteToFrequency);
    }

    export function handleStopNote(note) {
        if (oscillatorInstance) {
            oscillatorInstance.stop();
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
