// channelSettings.js

// Importing the ChannelSettingsManager functionality
// Make sure that ChannelSettingsManager.js is loaded before this script in your HTML
const settingsManager = new ChannelSettingsManager();

// Initial setup: load default settings for all channels
settingsManager.initializeDefaultSettings();

console.log("[channelSettings.js] Initialized default channel settings:", settingsManager.getSettings());

function captureSettings(selectedControlChannel) {    
    console.log("[channelSettings.js] captureSettings called for channel:", selectedControlChannel);

    const container = document.querySelector('.synth-container');
    if (!container) {
        console.error(`[channelSettings.js] No container found for controlChannelId: ${selectedControlChannel}`);
        return;
    }
    
    console.log("[channelSettings.js] Found container for controlChannelId:", selectedControlChannel);

    // Delegate the capturing of settings to settingsManager
    settingsManager.captureSettings(selectedControlChannel, container);

    // Capture arpNotes for the selected channel
    if (selectedControlChannel !== "all") {
        const arpNotes = arpUI.arpNotesByChannel[selectedControlChannel];
        settingsManager.updateArpNotes(selectedControlChannel, arpNotes);
        console.log("[channelSettings.js] arpUI before update:", arpUI);

        arpUI.updateAllChannel();

        console.log("[channelSettings.js] arpUI after update:", arpUI);
    }
}

function applySettings(controlChannelId, selectedChannel) {
    console.log("[channelSettings.js] applySettings called for channel:", controlChannelId);

    // Delegate the applying of settings to settingsManager
    const container = document.querySelector('.synth-container');
    if (container) {
        settingsManager.applySettings(controlChannelId, selectedChannel, container, arpUI.updateArpNotesDisplay);
    } else {
        console.error("Container element not found for applying settings.");
    }
}

document.addEventListener('change', function(e) {
    const element = e.target;
    const selectedControlChannel = element.closest('.control-channel-btn')?.getAttribute('data-control-channel-id');
    if (selectedControlChannel) {
        captureSettings(selectedControlChannel);
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const defaultControlChannelId = 'all';
    applySettings(defaultControlChannelId, defaultControlChannelId); // Initialize the UI with default settings
});
