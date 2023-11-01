<!-- Piano.svelte -->

<script>
    import { pianoKeys, midiMessage } from './pianoStore.js';
    import { midiNoteOn, midiNoteOff } from './midiHelpers.js';

    let keyNumber = 1;

    function createKeys() {
        let keys = [];
        for (let i = 0; i < 52; i++) {
            let midiNote = keyNumber + 23;
            keys.push({ type: 'white', number: keyNumber, midiNote: midiNote, left: i * 23, lit: false });

            if (i % 7 !== 2 && i % 7 !== 6) {
                keys.push({ type: 'black', number: keyNumber + 1, midiNote: midiNote + 1, left: 15 + i * 23, lit: false });
                keyNumber += 2;
            } else {
                keyNumber += 1;
            }
        }
        return keys;
    };

    pianoKeys.set(createKeys());

   // Function to light up a key
   function lightUpKey(keyIndex) {
        pianoKeys.update(keys => keys.map((key, index) => 
            index === keyIndex ? {...key, lit: true} : key
        ));
        console.log('Piano: Key lit up at index', keyIndex);
    }

    // Function to turn off the light on a key
    function lightOffKey(keyIndex) {
        pianoKeys.update(keys => {
            // Check if the key at the given index is already lit
            if (keys[keyIndex].lit) {
                console.log('Piano: Key turned off at index', keyIndex);
                return keys.map((key, index) => 
                    index === keyIndex ? {...key, lit: false} : key
                );
            }
            // If the key is not lit, no need to update or log
            return keys;
        });
    }

    $: {
        if ($midiMessage) {
            if ($midiMessage.type === 'noteOn') {
                midiNoteOn($midiMessage.note, lightUpKey);
            } else if ($midiMessage.type === 'noteOff') {
                midiNoteOff($midiMessage.note, lightOffKey);
            }
        }
    }
</script>


<style>
    .piano {
        display: flex;
        align-items: center;
        border: 5px solid black;
        border-radius: 10px;
        padding: 10px;
        background-color: #333;
    }
    .keyboard {
        position: relative;
        width: 1196px;
        height: 150px;
        background-color: white;
        border: 2px solid black;
        border-radius: 5px;
    }
    .white-key, .black-key {
        cursor: pointer;
        position: absolute; /* Use absolute positioning */
    }
    .white-key {
        width: 23px;
        height: 100%;
        border-right: 1px solid black;
        background-color: white;
        display: inline-block;
        color: black;
        font-size: 10px;
        text-align: center;
        line-height: 150px;
    }
    .black-key {
        width: 14px;
        height: 60%;
        position: absolute;
        top: 0;
        background-color: black;
        z-index: 2;
        color: white;
        font-size: 10px;
        text-align: center;
        line-height: 90px;
    }
    .end-block {
        width: 20px;
        height: 150px;
        background-color: #333;
        border-radius: 5px;
    }
    .lit {
        background-color: #f0e68c; /* Example color, choose what suits your design */
        /* Add more styling as needed, like a glow effect */
    }
</style>

<div class="piano">
    <div class="end-block"></div>
    <div class="keyboard">
        {#each $pianoKeys as key, index}
        <div 
            class="{key.type}-key {key.lit ? 'lit' : ''}" 
            style="left: {key.left}px;"
            on:mousedown={() => lightUpKey(index)}
            on:mouseup={() => lightOffKey(index)}
            on:mouseleave={() => lightOffKey(index)}
        >
            {key.number}
        </div>
        {/each}
    </div>
    <div class="end-block"></div>
</div>





