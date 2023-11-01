// midiHelpers.js

import { pianoKeys } from './pianoStore.js';

function getKeys() {
    let keys;
    pianoKeys.subscribe($keys => {
        keys = $keys;
    })();
    return keys;
}

export function midiNoteOn(midiNote, lightUpKey) {
    const keys = getKeys();
    let keyIndex;
    keys.forEach((key, index) => {
        if (key.midiNote === midiNote) {
            keyIndex = index;
        }
    });
    if (keyIndex !== undefined) lightUpKey(keyIndex);
}

export function midiNoteOff(midiNote, lightOffKey) {
    const keys = getKeys();
    let keyIndex;
    keys.forEach((key, index) => {
        if (key.midiNote === midiNote) {
            keyIndex = index;
        }
    });
    if (keyIndex !== undefined) lightOffKey(keyIndex);
}
