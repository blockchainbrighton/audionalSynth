<script>


    let oscillator;
    let waveform = 'sine';
    let attack = 0.1;
    let decay = 0.1;
    let sustain = 0.7;
    let release = 0.5;

    export function playNote(note, velocity, audioContext, gainNode, midiNoteToFrequency) {
        if (!audioContext) return;

        oscillator = audioContext.createOscillator();
        oscillator.type = waveform;
        oscillator.frequency.value = midiNoteToFrequency(note);
        oscillator.connect(gainNode);
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(velocity / 127, audioContext.currentTime + attack);
        gainNode.gain.linearRampToValueAtTime(sustain, audioContext.currentTime + attack + decay);
        oscillator.start();
    }

    export function stopNote(note, audioContext, gainNode) {
        if (oscillator) {
            gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + release);
            oscillator.stop(audioContext.currentTime + release);
            oscillator.disconnect();
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
