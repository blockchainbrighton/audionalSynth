// arrayManagement.js

// Function to update note array for a specific channel
function updateNoteArray(channelNumber, noteArray) {
    if (channelNumber >= 1 && channelNumber <= 16) {
        const channelKey = `channel${channelNumber}`;
        synthSettings.arpNoteArrays[channelKey] = noteArray;
    } else {
        console.error("Invalid channel number");
    }
}

// Function to apply settings to the synth
function applySynthSettings(settings) {
    // Assuming you have a way to apply these settings to your synth
    // Update the synth with the provided settings
    // Example:
    // setOscillatorType(settings.oscillatorType);
    // setFilterType(settings.filterType);
    // setADSR(settings.adsrEnvelope);
    // setEffectType(settings.effectType);
    // setArpeggiatorSettings(settings.arpeggiator);
}

// Function to get settings for a specific channel
function getChannelSettings(channelNumber) {
    if (channelNumber >= 1 && channelNumber <= 16) {
        const channelKey = `channel${channelNumber}`;
        return {
            ...synthSettings,
            arpNoteArrays: synthSettings.arpNoteArrays[channelKey]
        };
    } else {
        console.error("Invalid channel number");
        return null;
    }
}
