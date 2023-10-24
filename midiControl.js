// midiControl.js


const A4_MIDI_NUMBER = 69;
const A4_FREQUENCY = 440;
const arpNoteNames = [];

function onMIDISuccess(e) {
    let o = e.inputs.values();
    for (let e = o.next(); e && !e.done; e = o.next()) {
        e.value.onmidimessage = onMIDIMessage;
    }
}

function onMIDIFailure() {
    console.warn("Could not access your MIDI devices.");
}

function onMIDIMessage(e) {
    console.log("Received MIDI message:", e.data);
    let status = e.data[0];
    let midiChannel = (status & 0x0F) + 1;  // Extract MIDI channel from status byte
    console.log("[onMIDIMessage] MIDI Channel:", midiChannel);
    let note = e.data[1];
    let velocity = e.data.length > 2 ? e.data[2] : 0;
    let selectedChannel = getSelectedChannel();
    console.log("[onMIDIMessage] Selected Control Channel:", selectedChannel);
    
    switch (status & 0xF0) {  // Using bitwise AND to mask the channel bits
        case 144:
            if (velocity > 0) {
                let freq = midiNoteToFrequency(note);
                console.log(`Note On. MIDI note: ${note}, Frequency: ${freq}`);
                if (isArpeggiatorOn) {
                    arpNotesByChannel[selectedChannel].push(freq);
                    updateArpNotesDisplay();
                } else {
                    playMS10TriangleBass(freq, midiChannel); // Pass the MIDI channel as the synthesizer channel
                }
            }
            break;
        case 128:
            console.log(`Note Off. MIDI note: ${note}`);
            if (isArpeggiatorOn) {
                let freq = midiNoteToFrequency(note);
                let index = arpNotesByChannel[selectedChannel].indexOf(freq);
                if (index !== -1) arpNotesByChannel[selectedChannel].splice(index, 1);
            }
            break;
        default:
            console.log(`Unhandled MIDI message type: ${status & 0xF0}`);
    }
}

function midiNoteToFrequency(note) {
    if (note < 0 || note > 127) {
        console.error("Invalid MIDI note:", note);
        return null;
    }
    return Math.pow(2, (note - A4_MIDI_NUMBER) / 12) * A4_FREQUENCY;
}

function playNote(note, channel = 1) {
    let freq = 440 * Math.pow(2, (note - 69) / 12);
    playMS10TriangleBass(freq, channel); // Use the provided channel
}

function stopNote(note) {}

function getVolume() {
    return document.getElementById("volume").value / 100;
}

navigator.requestMIDIAccess ? navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure) : console.warn("WebMIDI is not supported in this browser.");
