
// saveLoad.js - save and load synth settings

function initializeLocalStorage() {
    // Define default settings
    const defaultSettings = {
        note: "51.91308719749314",
        waveform: "sawtooth",
        attack: "10",
        release: "519",
        cutoff: "2000",
        resonance: "3.8",
        volume: "1",
        arpTempo: "120",
        arpPattern: "up",
        arpNotes: [] // Initialize arpNotes as empty
    };

    // Initialize default settings for channels 1-16
    const channelSettings = { all: { ...defaultSettings } };
    for (let i = 1; i <= 16; i++) {
        channelSettings[i] = { ...defaultSettings };
    }

    // Save default settings to localStorage
    localStorage.setItem('channelSettings', JSON.stringify(channelSettings));
}

function saveSettings() {
            const settings = {
                note: document.getElementById("note").value,
                waveform: document.getElementById("waveform").value,
                attack: document.getElementById("attack").value,
                release: document.getElementById("release").value,
                cutoff: document.getElementById("cutoff").value,
                resonance: document.getElementById("resonance").value,
                volume: document.getElementById("volume").value,
                arpTempo: document.getElementById("arpTempo").value,
                arpPattern: document.getElementById("arpPattern").value,
                arpNotes: arpNotes
            };

            const settingsStr = JSON.stringify(settings);
            const blob = new Blob([settingsStr], {type: "application/json"});
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = "synth_settings.json";
            a.click();
        }

function loadSettings() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';

    input.onchange = event => {
        const file = event.target.files[0];
        if (!file) {
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            const settings = JSON.parse(e.target.result);

            document.getElementById("note").value = settings.note;
            document.getElementById("waveform").value = settings.waveform;
            document.getElementById("attack").value = settings.attack;
            document.getElementById("release").value = settings.release;
            document.getElementById("cutoff").value = settings.cutoff;
            document.getElementById("resonance").value = settings.resonance;
            document.getElementById("volume").value = settings.volume;
            document.getElementById("arpTempo").value = settings.arpTempo;
            document.getElementById("arpPattern").value = settings.arpPattern;
            
            if (settings.arpNotes) {
                arpNotes = settings.arpNotes;
                updateArpNotesDisplay();
            }
       // Update localStorage with the loaded settings
       localStorage.setItem('channelSettings', JSON.stringify(settings));
    };
        reader.readAsText(file);
    };

    input.click();
}

document.addEventListener("DOMContentLoaded", function() {
    initializeLocalStorage();
});