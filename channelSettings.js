// channelSettings.js

// Importing the ChannelSettingsManager functionality
// Make sure that ChannelSettingsManager.js is loaded before this script in your HTML
const settingsManager = new ChannelSettingsManager();

// Initial setup: load default settings for all channels
settingsManager.initializeDefaultSettings();

console.log("[channelSettings.js] Initialized default channel settings:", settingsManager.getSettings());

function captureSettings(selectedControlChannel) {    
    const container = document.querySelector('.synth-container');
    if (!container) {
        console.error(`[channelSettings.js] No container found for controlChannelId: ${selectedControlChannel}`);
        return;
    }
    
    console.log("[channelSettings.js] Found container for controlChannelId:", selectedControlChannel);

    // Delegate the capturing of settings to settingsManager
    settingsManager.captureChannelSettings(selectedControlChannel, container);

    // Capture arpNotes for the selected channel
    if (selectedControlChannel !== "all") {
        const arpNotes = arpUI.arpNotesByChannel[selectedControlChannel];
        settingsManager.updateArpNotes(selectedControlChannel, arpNotes);
        arpUI.updateAllChannel();
    }

    // Save to localStorage
    localStorage.setItem('channelSettings', JSON.stringify(settingsManager.getSettings()));
}

function applySettings(controlChannelId, selectedChannel) {
    // Check localStorage for saved settings
    const savedSettings = JSON.parse(localStorage.getItem('channelSettings'));
    if (savedSettings) {
        settingsManager.applySettings(savedSettings);
    }

    // Delegate the applying of settings to settingsManager
    const container = document.querySelector('.synth-container');
    if (container) {
        settingsManager.applySettings(controlChannelId, selectedChannel, container, arpUI.updateArpNotesDisplay);
    } else {
        console.error("Container element not found for applying settings.");
    }

    // Update the arp notes display after applying the settings
    if (arpUI && arpUI.arpNotesByChannel) {
    arpUI.updateArpNotesDisplay();
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
    localStorage.removeItem('channelSettings'); // Clear localStorage for channelSettings
    const defaultControlChannelId = 'all';
    applySettings(defaultControlChannelId, defaultControlChannelId); // Initialize the UI with default settings
});
