// pianoStore.js

import { writable } from 'svelte/store';

export const pianoKeys = writable([]);
export const midiMessage = writable(null);
