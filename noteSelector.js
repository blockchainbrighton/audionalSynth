// noteSelector.js
const musicalNotes = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
const keyNames = ["A","W","S","E","D","F","T","G","Y","H","U","J","K","O","L","P"];
const keyToMidiNote = {};
const startingMidiNote = 21;

for (let e = 0; e < keyNames.length; e++) {
    keyToMidiNote["Key" + keyNames[e]] = 21 + e;
}

window.noteNameToFrequency = function(t, o) {
    const n = musicalNotes.indexOf(t) + 12 * (o + 1);
    return 440 * Math.pow(2, (n - 69) / 12);
}

window.frequencyToNoteName = function(t) {
    let o = Math.round(12 * Math.log2(t / 440) + 69);
    return musicalNotes[o % 12] + (Math.floor(o / 12) - 1);
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
}

document.addEventListener("DOMContentLoaded", populateNoteSelectorWithKeys);

document.addEventListener("keydown", function(e) {
    const o = keyToMidiNote[e.code];
    if (o) {
        const n = 440 * Math.pow(2, (o - 69) / 12);
        console.log(`[KEYDOWN] Key: ${e.code}, MIDI note: ${o}, Frequency: ${n}`);
        
        let selectedChannel = getSelectedChannel(); // Get the currently selected control channel

        playMS10TriangleBass(n, selectedChannel); // Pass the selected control channel instead of the MIDI channel
        arpNotesByChannel[selectedChannel].push(n);
        updateArpNotesDisplay();
    }
});

document.addEventListener("keyup", function(e) {
    const o = keyToMidiNote[e.code];
    if (o) {
        console.log(`[KEYUP] Key: ${e.code}, MIDI note: ${o}`);
    }
});

document.getElementById("arpToggle").addEventListener("click", toggleArpeggiator);
