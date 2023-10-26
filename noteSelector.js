// noteSelector.js
const musicalNotes = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
const keyNames = ["A","W","S","E","D","F","T","G","Y","H","U","J","K","O","L","P"];
const keyToMidiNote = {};
const startingMidiNote = 21;

for (let e = 0; e < keyNames.length; e++) {
    keyToMidiNote["Key" + keyNames[e]] = 21 + e;
}
console.log("[INIT] keyToMidiNote mapping:", keyToMidiNote);

// Pre-calculated table for note names and frequencies
const noteFrequencyTable = {};
let octave = 0;
let noteIndex = 0;

for (let i = 0; i < 88; i++) {
    const frequency = 440 * Math.pow(2, (i - 49) / 12);
    const noteName = `${musicalNotes[noteIndex]}${octave}`;
    noteFrequencyTable[noteName] = frequency;

    noteIndex++;
    if (noteIndex >= 12) {
        noteIndex = 0;
        octave++;
    }
}

window.noteNameToFrequency = function(noteName) {
    console.log(`[CONVERT] Note: ${noteName} to Frequency: ${noteFrequencyTable[noteName]}`);
    return noteFrequencyTable[noteName];
}

window.frequencyToNoteName = function(frequency) {
    const noteName = Object.keys(noteFrequencyTable).find(key => noteFrequencyTable[key] === frequency);
    console.log(`[CONVERT] Frequency: ${frequency} to Note: ${noteName}`);
    return noteName;
}

function populateNoteSelectorWithKeys() {
    const noteDropdown = document.getElementById('note');
    let octave = 0;
    let noteIndex = 0;
    let keyIndex = 0;
    let c1Frequency = null;
    
    for (let i = 0; i < 88; i++) {
        const option = document.createElement('option');
        const frequency = 440 * Math.pow(2, (i - 49) / 12);
    
        if (musicalNotes[noteIndex] === "C" && octave === 1) {
            c1Frequency = frequency;
        }
        
        option.value = frequency;
        option.textContent = `${musicalNotes[noteIndex]}${octave} | ${keyNames[keyIndex]}`;
        noteDropdown.appendChild(option);
        
        noteIndex++;
        keyIndex++;
        if (noteIndex >= 12) {
            noteIndex = 0;
            octave++;
        }
        if (keyIndex >= keyNames.length) {
            keyIndex = 0;
        }
    }
    
    if (c1Frequency) {
        noteDropdown.value = c1Frequency;
    }
    console.log("[INIT] Note selector populated.");
}

document.addEventListener("DOMContentLoaded", populateNoteSelectorWithKeys);

document.addEventListener("keydown", function(e) {
    const o = keyToMidiNote[e.code];
    if (o) {
        const n = 440 * Math.pow(2, (o - 69) / 12);
        console.log(`[KEYDOWN] Key: ${e.code}, MIDI note: ${o}, Frequency: ${n}`);
        
        let selectedChannel = arp.getSelectedChannel(); // Get the currently selected control channel
        console.log(`[KEYDOWN] Selected Channel: ${selectedChannel}`);

        playMS10TriangleBass(n, selectedChannel); // Pass the selected control channel instead of the MIDI channel
        arp.arpNotesByChannel[selectedChannel].push(n);
        console.log(`[KEYDOWN] arpNotesByChannel after push:`, arp.arpNotesByChannel);
        arp.updateArpNotesDisplay();
    }
});

document.addEventListener("keyup", function(e) {
    const o = keyToMidiNote[e.code];
    if (o) {
        console.log(`[KEYUP] Key: ${e.code}, MIDI note: ${o}`);
    }
});