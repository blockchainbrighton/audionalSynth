<script>
    import { pianoKeys } from './pianoStore.js';
    import { midiMessage } from './pianoStore.js';

    let keyNumber = 1;
    
    let createKeys = () => {
        let keys = [];
        for (let i = 0; i < 52; i++) {
            // Adjust the offset here by subtracting 9 to align with standard MIDI note numbers
            keys.push({ type: 'white', number: keyNumber, midiNote: keyNumber + 20 - 9, left: i * 23, lit: false });
            
            if (i % 7 !== 2 && i % 7 !== 6) {
                keys.push({ type: 'black', number: keyNumber + 1, midiNote: keyNumber + 21 - 9, left: 15 + i * 23, lit: false });
                keyNumber += 2;
            } else {
                keyNumber += 1;
            }
        }
        return keys;
    };

    // Initialize the store with the keys
    pianoKeys.set(createKeys());
    
    function lightUpKey(keyIndex) {
        pianoKeys.update(keys => keys.map((key, index) => 
            index === keyIndex ? {...key, lit: true} : key
        ));
    }

    function lightOffKey(keyIndex) {
        pianoKeys.update(keys => keys.map((key, index) => 
            index === keyIndex ? {...key, lit: false} : key
        ));
    }

    // Subscribe to MIDI messages
    $: {
        if ($midiMessage) {
            if ($midiMessage.type === 'noteOn') {
                midiNoteOn($midiMessage.note);
            } else if ($midiMessage.type === 'noteOff') {
                midiNoteOff($midiMessage.note);
            }
        }
    }

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