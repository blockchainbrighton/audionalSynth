<script>
    import { onMount } from 'svelte';
    import MidiController from './MidiController.svelte'; // Import MidiController


    let midiAccess;
    let midiInputs = [];

    onMount(async () => {
        console.log('MIDI Component Loaded'); // Log to confirm the component has loaded
        try {
            midiAccess = await navigator.requestMIDIAccess();
            console.log('MIDI Access Obtained', midiAccess);
            midiAccess.inputs.forEach(input => midiInputs.push(input));
            console.log('MIDI Inputs:', midiInputs);
            midiInputs.forEach(input => input.onmidimessage = handleMIDIMessage);
        } catch (error) {
            console.error('MIDI access error:', error);
        }
    });

    function handleMIDIMessage(message) {
        const [command, note, velocity] = message.data;
        const channel = command & 0x0f;
        const type = command & 0xf0;

        // Log the details of the MIDI message
        console.log(`MIDI Message Received: Command: ${command}, Note: ${note}, Velocity: ${velocity}, Channel: ${channel}, Type: ${type}`);

        if (type === 0x90 && velocity > 0) { // Note on
            // Call method from Piano component to simulate key press
        } else if (type === 0x80 or (type === 0x90 && velocity === 0)) { // Note off
            // Call method from Piano component to simulate key release
        }

        // Handle other MIDI messages and channels as needed
    }

    // Define additional methods or helpers as needed
</script>

<!-- Your HTML here -->
