// midiHelpers.js

import { pianoKeys } from './pianoStore.js';
import { writable } from 'svelte/store';

export const midiData = writable(null);

function getKeys() {
    let keys;
    pianoKeys.subscribe($keys => {
        keys = $keys;
    })();
    console.log('midiHelpers: Retrieved keys', keys);
    return keys;
}

export function midiNoteOn(midiNote, velocity, lightUpKey) {
    const keys = getKeys();
    let keyIndex;
    keys.forEach((key, index) => {
        if (key.midiNote === midiNote) {
            keyIndex = index;
        }
    });
    console.log(`midiHelpers: MIDI Note On: MIDI Note = ${midiNote}, Key Index = ${keyIndex}, Velocity = ${velocity}`);
    if (keyIndex !== undefined) lightUpKey(keyIndex, velocity);
}

export function midiNoteOff(midiNote, lightOffKey) {
    const keys = getKeys();
    let keyIndex;
    keys.forEach((key, index) => {
        if (key.midiNote === midiNote) {
            keyIndex = index;
        }
    });
    console.log(`midiHelpers: MIDI Note Off: MIDI Note = ${midiNote}, Key Index = ${keyIndex}`);
    if (keyIndex !== undefined) lightOffKey(keyIndex);
}

// Additional function to handle MIDI control change messages
export function midiControlChange(controlNumber, value) {
    // Handle MIDI control change messages here
    // For example, you can adjust volume, modulation, or other parameters based on controlNumber and value
    console.log(`midiHelpers: Control Change: Control Number = ${controlNumber}, Value = ${value}`);
}


