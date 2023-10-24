// channelSettings.js

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
            if (element.type === 'checkbox') {
                settings[key] = element.checked;
            } else {
                settings[key] = element.value;
            }
        }
    });

    console.log(`[channelSettings.js] Captured settings for controlChannelId ${selectedControlChannel}:`, settings);

    channelSettings[selectedControlChannel] = { ...channelSettings[selectedControlChannel], ...settings };

    // Capture arpNotes for the selected channel
    if (selectedControlChannel !== "all") {
        channelSettings[selectedControlChannel].arpNotes = arp.arpNotesByChannel[selectedControlChannel];
        arp.updateAllChannel();
    }

    console.log(`[channelSettings.js] arpNotes for channel ${selectedControlChannel}:`, arp.arpNotesByChannel[selectedControlChannel]);

    // Save to localStorage
    localStorage.setItem('channelSettings', JSON.stringify(channelSettings));
}

function getSettings(controlChannel) {
    if (!channelSettings[controlChannel]) {
        console.warn(`[channelSettings.js] Using default settings for Control Channel ${controlChannel} as specific settings were not found.`);
        return { ...channelSettings.all };
    }
    console.log(`[channelSettings.js] Retrieved settings for Control Channel ${controlChannel}:`, channelSettings[controlChannel]);
    return channelSettings[controlChannel];
}

function applySettings(controlChannelId, selectedChannel) {
    // Check localStorage for saved settings
    const savedSettings = JSON.parse(localStorage.getItem('channelSettings'));
    if (savedSettings) {
        Object.assign(channelSettings, savedSettings);
    }

    const settings = channelSettings[controlChannelId];
    if (!settings) {
        console.error(`[channelSettings.js] No settings found for controlChannelId="${controlChannelId}"`);
        return;
    }

    // Apply the arpNotes for the selected channel
    arp.arpNotesByChannel[controlChannelId] = settings.arpNotes || [];
    arp.updateAllChannel();
    console.log("[applySettings] Updated arpNotes for all channel:", channelSettings["all"].arpNotes);



    console.log(`[channelSettings.js] Applying settings for controlChannelId ${controlChannelId}, Control Channel ${selectedChannel}:`, settings);

    const container = document.querySelector('.synth-container');

    for (const [key, value] of Object.entries(settings)) {
        const element = container.querySelector(`#${key}`);
        if (element) {
            if (element.type === 'checkbox') {
                element.checked = value;
            } else {
                element.value = value;
            }
        }
    }


    // Update the arp notes display after applying the settings
    arp.updateArpNotesDisplay();

    console.log(`[channelSettings.js] arpNotes after applying settings for channel ${controlChannelId}:`, arp.arpNotesByChannel[controlChannelId]);


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
    // Clear localStorage for channelSettings
    localStorage.removeItem('channelSettings');

    // Initialize the UI with default settings for the selected control channel
    const defaultControlChannelId = 'all';
    applySettings(defaultControlChannelId, defaultControlChannelId);
});
