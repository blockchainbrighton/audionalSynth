const channelSettings = {
    all: {
        waveform: 'sawtooth',
        note: 'defaultNote',
        attack: '10',
        release: '500',
        cutoff: '2000',
        resonance: '5',
        volume: '100',
        arpPattern: 'up',
        arpSpeed: 'normal',
        arpTempo: '105',
        bpmAdjustValue: '0.5',
        timingAdjust: '0',
        useSequencerTiming: false    
    }
};

// Initialize default settings for channels 1-16
for (let i = 1; i <= 16; i++) {
    channelSettings[i] = { ...channelSettings.all };
}

console.log("[channelSettings.js] Initialized default channel settings:", channelSettings);

function captureSettings(selectedControlChannel) {    
    const container = document.querySelector('.synth-container');
    if (!container) {
        console.error(`[channelSettings.js] No container found for controlChannelId: ${selectedControlChannel}`);
        return;
    }
    
    console.log("[channelSettings.js] Found container for controlChannelId:", selectedControlChannel);

    const settingsKeys = Object.keys(channelSettings.all);
    const settings = {};

    settingsKeys.forEach(key => {
        const element = container.querySelector(`#${key}`);
        if (element) {
            settings[key] = element.type === 'checkbox' ? element.checked : element.value;
        }
    });

    console.log(`[channelSettings.js] Captured settings for controlChannelId ${selectedControlChannel}:`, settings);

    channelSettings[selectedControlChannel] = { ...channelSettings[selectedControlChannel], ...settings };

    // Capture arpNotes for the selected channel
    if (selectedControlChannel !== "all") {
        channelSettings[selectedControlChannel].arpNotes = arpUI.arpNotesByChannel[selectedControlChannel];
        arpUI.updateAllChannel();
    }

    console.log(`[channelSettings.js] arpNotes for channel ${selectedControlChannel}:`, arpUI.arpNotesByChannel[selectedControlChannel]);

    // Save to localStorage
    localStorage.setItem('channelSettings', JSON.stringify(channelSettings));
}

function getSettings(controlChannel) {
    const settings = channelSettings[controlChannel] || { ...channelSettings.all };
    console.log(`[channelSettings.js] Retrieved settings for Control Channel ${controlChannel}:`, settings);
    return settings;
}

function applySettings(controlChannelId, selectedChannel) {
    // Check localStorage for saved settings
    const savedSettings = JSON.parse(localStorage.getItem('channelSettings'));
    if (savedSettings) {
        Object.assign(channelSettings, savedSettings);
    }

    const settings = getSettings(controlChannelId);
    console.log(`[channelSettings.js] Applying settings for controlChannelId ${controlChannelId}, Control Channel ${selectedChannel}:`, settings);

    const container = document.querySelector('.synth-container');
    for (const [key, value] of Object.entries(settings)) {
        const element = container.querySelector(`#${key}`);
        if (element) {
            element.type === 'checkbox' ? element.checked = value : element.value = value;
        }
    }

    // Update the arp notes display after applying the settings
    arpUI.updateArpNotesDisplay();

    console.log(`[channelSettings.js] Applied settings for controlChannelId ${controlChannelId}, Control Channel ${selectedChannel}:`, settings);
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
