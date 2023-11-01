<script>
    import { onMount } from 'svelte';
    import { midiMessage } from './pianoStore.js';
    import { pianoKeys } from './pianoStore.js';


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


    function midiNoteOn(midiNote) {
        let keyIndex;
        $pianoKeys.forEach((key, index) => {
            if (key.midiNote === midiNote) {
                keyIndex = index;
            }
        });
        if (keyIndex !== undefined) lightUpKey(keyIndex);
    }

    function midiNoteOff(midiNote) {
        let keyIndex;
        $pianoKeys.forEach((key, index) => {
            if (key.midiNote === midiNote) {
                keyIndex = index;
            }
        });
        if (keyIndex !== undefined) lightOffKey(keyIndex);
    }

    function handleMIDIMessage(message) {
        const [command, note, velocity] = message.data;
        const type = command & 0xf0;

         // Log the received MIDI message
        console.log("Received MIDI message:", { command, note, velocity, type });

        if (type === 0x90 && velocity > 0) { // Note on
            midiMessage.set({ type: 'noteOn', note });
        } else if (type === 0x80 || (type === 0x90 && velocity === 0)) { // Note off
            midiMessage.set({ type: 'noteOff', note });
        }
    }
</script>