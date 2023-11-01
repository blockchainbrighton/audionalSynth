// midiStore.js

import { writable } from 'svelte/store';

export const midiData = writable(null); // Initialize with null or appropriate initial value

// Added log to track changes in midiData
midiData.subscribe(value => {
    console.log('midiStore: midiData changed to', value);
});
