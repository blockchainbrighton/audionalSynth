<script>
    import Piano from './Piano.svelte';
    import { onMount } from 'svelte';

    let piano; // Reference to the Piano component

    onMount(() => {
        if (navigator.requestMIDIAccess) {
            navigator.requestMIDIAccess()
                .then(midiAccess => {
                    for (let input of midiAccess.inputs.values()) {
                        input.onmidimessage = handleMIDIMessage;
                    }
                })
                .catch(err => console.error('MIDI access error:', err));
        } else {
            console.error('MIDI access is not supported in this browser.');
        }
    });

    function handleMIDIMessage(event) {
        const [command, note, velocity] = event.data;

        // MIDI 'note on' command
        if (command === 144 && velocity > 0) {
            piano.midiNoteOn(note);
        }

        // MIDI 'note off' command or 'note on' with zero velocity
        if (command === 128 || (command === 144 && velocity === 0)) {
            piano.midiNoteOff(note);
        }
    }
</script>

<main>
    <h1>Audional Synth - Basic 88 note Keyboard</h1>
    <Piano bind:this={piano} />
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
