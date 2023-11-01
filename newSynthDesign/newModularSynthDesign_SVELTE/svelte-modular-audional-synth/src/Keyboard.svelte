<script>
  import { onMount, onDestroy } from 'svelte';
  import { writable } from 'svelte/store';

  export let onNoteOn;
  export let onNoteOff;

  const activeKeys = writable(new Set());
  const isPoweredOn = writable(false);
  let audioContext;

  onMount(async () => {
      if (navigator.requestMIDIAccess) {
          const midiAccess = await navigator.requestMIDIAccess();
          midiAccess.inputs.forEach((input) => {
              input.onmidimessage = handleMIDIMessage;
          });
      }
  });

  onDestroy(() => {
    if (audioContext) {
      audioContext.close();
    }
  });

  function togglePower() {
    isPoweredOn.update(state => {
      if (state) {
        if (audioContext) {
          audioContext.close();
        }
      } else {
        audioContext = new AudioContext();
      }
      return !state;
    });
  }

  function handleMIDIMessage(message) {
      if (!$isPoweredOn) return;

      const [command, note, velocity] = message.data;

      if (command === 144 && velocity > 0) { // Note on
          activeKeys.update(keys => keys.add(note));
          onNoteOn && onNoteOn(note, velocity, audioContext);
      } else if (command === 128 || (command === 144 && velocity === 0)) { // Note off
          activeKeys.update(keys => {
              keys.delete(note);
              return keys;
          });
          onNoteOff && onNoteOff(note, audioContext);
      }
  }

  function playNote(index) {
    if (!$isPoweredOn) return;
    const note = index + 21;
    onNoteOn && onNoteOn(note, 100, audioContext);
    activeKeys.update(keys => keys.add(note));
  }

  function stopNote(index) {
    if (!$isPoweredOn) return;
    const note = index + 21;
    onNoteOff && onNoteOff(note, audioContext);
    activeKeys.update(keys => keys.delete(note));
  }

  // Helper function to determine if a key is a black key
  function isBlackKey(keyIndex) {
      const pattern = [false, true, false, true, false, false, true, false, true, false, true, false];
      return pattern[keyIndex % 12];
  }
</script>

<div class="controls">
  <button on:click={togglePower} class:active={$isPoweredOn}>Power</button>
</div>

<div class="piano-frame">
  <div class="keyboard">
    {#each Array(88) as _, index}
        <div
          class={`key ${isBlackKey(index) ? 'black' : 'white'} ${$activeKeys.has(index + 21) ? 'active' : ''}`}
          on:click={() => playNote(index)}
          on:mouseup={() => stopNote(index)}
          on:mouseleave={() => stopNote(index)}
        ></div>
    {/each}
  </div>
</div>

<style>
  .controls {
    margin-bottom: 10px;
  }
  .piano-frame {
    border: 2px solid black;
    border-radius: 10px;
    padding: 10px;
    background-color: #333;
  }
  .keyboard {
    display: flex;
    justify-content: center;
  }
  .key {
    cursor: pointer;
    width: 23px;
    height: 120px;
    border: 1px solid black;
    box-sizing: border-box;
    position: relative;
    background-color: grey;
  }
  .white {
    background-color: white;
    z-index: 1;
  }
  .black {
    background-color: black;
    width: 15px;
    margin-left: -7.5px;
    z-index: 2;
    position: absolute;
    height: 75px;
    top: 0;
  }
  .active {
    background-color: red;
  }
  button.active {
    background-color: green;
    color: white;
  }
</style>

