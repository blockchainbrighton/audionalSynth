// pianoStore.js
import { writable } from 'svelte/store';

export const pianoKeys = writable([]);
export const midiMessage = writable(null);
export const noteAction = writable({ action: null, note: null });

// Function to create and return a new audio context
export function createAudioContext() {
    return new (window.AudioContext || window.webkitAudioContext)();
}
