<!-- MidiController.svelte -->

<script>
    import { onMount } from 'svelte';
    import { midiData } from './midiStore.js'; // Import the midiData store

    let midiAccess;
    let midiInputs = [];

    onMount(async () => {
        try {
            midiAccess = await navigator.requestMIDIAccess();
            midiAccess.inputs.forEach(input => midiInputs.push(input));
            midiInputs.forEach(input => input.onmidimessage = handleMIDIMessage);
        } catch (error) {
            console.error('MIDI access error:', error);
        }
    });

    function handleMIDIMessage(message) {
        const [command, note, velocity] = message.data;
        const type = command & 0xf0;
        const midiMessage = { command, note, velocity, type };

        // Update the midiData store with the received MIDI message
        midiData.set(midiMessage);

        // After setting the midiData store
        console.log('MidiController: midiData store set to', $midiData);
    }
</script>
