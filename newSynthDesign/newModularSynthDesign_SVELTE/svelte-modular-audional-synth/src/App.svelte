<script>
    import Piano from './Piano.svelte';
    import MidiController from './MidiController.svelte'; // Import MidiController
</script>

<main>
    <h1>Audional Synth - Basic 88 note Keyboard</h1>
    <Piano />
    <MidiController /> <!-- Include MidiController component -->
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
