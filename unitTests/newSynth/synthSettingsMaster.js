// synthSettingsMaster.js

// Function to initialize note arrays for all 16 channels
function initializeAllChannelNoteArrays() {
    const noteArrays = {};
    for (let i = 1; i <= 16; i++) {
        noteArrays[`channel${i}`] = new Array(16).fill(null);
    }
    return noteArrays;
}

// Function to initialize synth settings for a single channel
function initializeSingleChannelSettings() {
    return {
        oscillatorType: "sine",
        filterType: "low-pass",
        adsrEnvelope: {
            attack: 0,
            decay: 0,
            sustain: 0,
            release: 0
        },
        effectType: "reverb",
        arpeggiator: {
            isEnabled: false,
            pattern: "up",
            tempo: 120,
            length: 16,
            speed: 4
        }
    };
}

// Function to initialize synth settings for all 16 channels
function initializeAllChannelSettings() {
    const channelSettings = {};
    for (let i = 1; i <= 16; i++) {
        channelSettings[`channel${i}`] = initializeSingleChannelSettings();
    }
    return channelSettings;
}

const synthSettings = {
    currentChannel: 1, // Default to channel 1
    masterSlaveMode: false, // true for Master, false for Slave
    channelSettings: initializeAllChannelSettings(), // Initialize settings for all channels
    arpNoteArrays: initializeAllChannelNoteArrays() // Initialize note arrays for all channels
};

// Export synthSettings if needed
// export { synthSettings };
