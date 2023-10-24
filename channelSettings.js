// channelSettings.js

const channelSettings = {
    all: getDefaultSettings() // Default settings for "all" control channel
};

// Initialize default settings for channels 1-16
for (let i = 1; i <= 16; i++) {
    channelSettings[i] = getDefaultSettings();
}

console.log("[channelSettings.js] Initialized default channel settings:", channelSettings);

function getDefaultSettings() {
    return {
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
    };

}

function captureSettings(selectedControlChannel) {    
    const container = document.querySelector(`[data-control-channel-id="${selectedControlChannel}"]`);
    
    if (!container) {
        console.error(`[channelSettings.js] No container found for controlChannelId: ${selectedControlChannel}`);
        return;
    }
    
    console.log("[channelSettings.js] Found container for controlChannelId:", selectedControlChannel);

    const settings = {
        waveform: container.querySelector('#waveform')?.value,
        note: container.querySelector('#note')?.value,
        attack: container.querySelector('#attack')?.value,
        release: container.querySelector('#release')?.value,
        cutoff: container.querySelector('#cutoff')?.value,
        resonance: container.querySelector('#resonance')?.value,
        volume: container.querySelector('#volume')?.value,
        arpPattern: container.querySelector('#arpPattern')?.value,
        arpSpeed: container.querySelector('#arpSpeed')?.value,
        arpTempo: container.querySelector('#arpTempo')?.value,
        bpmAdjustValue: container.querySelector('#bpmAdjustValue')?.value,
        timingAdjust: container.querySelector('#timingAdjust')?.value,
        useSequencerTiming: container.querySelector('#useSequencerTiming')?.checked
    };

    console.log(`[channelSettings.js] Captured settings for controlChannelId ${selectedControlChannel}:`, settings);

    if (!channelSettings[selectedControlChannel]) {
        channelSettings[selectedControlChannel] = getDefaultSettings();
    }
    channelSettings[selectedControlChannel] = { ...channelSettings[selectedControlChannel], ...settings };
}

function getSettings(controlChannel) {
    if (!channelSettings[controlChannel]) {
        console.warn(`[channelSettings.js] Using default settings for Control Channel ${controlChannel} as specific settings were not found.`);
        return getDefaultSettings();
    }
    console.log(`[channelSettings.js] Retrieved settings for Control Channel ${controlChannel}:`, channelSettings[controlChannel]);
    return channelSettings[controlChannel];
}


function applySettings(controlChannelId, controlChannel) {
    const settings = getSettings(controlChannel);
    const container = document.querySelector(`[data-control-channel-id="${controlChannelId}"]`);
    
    if (!container) {
        console.error(`[channelSettings.js] No element found with data-control-channel-id="${controlChannelId}"`);
        return;
    }

    console.log(`[channelSettings.js] Applying settings for controlChannelId ${controlChannelId}, Control Channel ${controlChannel}:`, settings);


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
    console.log(`[channelSettings.js] Applied settings for controlChannelId ${controlChannelId}, Control Channel ${controlChannel}:`, settings);
}



// Attach event listeners to update channelSettings in real-time
document.addEventListener('change', function(e) {
    const element = e.target;
    const selectedControlChannel = element.closest('.control-channel-btn')?.getAttribute('data-control-channel-id');
    if (selectedControlChannel) {
        captureSettings(selectedControlChannel);
    }
});

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the UI with default settings for the selected control channel
    const defaultControlChannelId = 'all'; // Default to "all" since we're using buttons now
    applySettings(defaultControlChannelId, defaultControlChannelId);
});

document.querySelectorAll(".control-channel-btn").forEach(button => {
    button.addEventListener('click', function(e) {
        const selectedControlChannel = e.target.getAttribute('data-control-channel-id');
        
        if (!selectedControlChannel) {
            console.error("[channelSettings.js] Missing selectedControlChannel");
            return;
        }
        // Log the entire current settings for the current channel
        console.log(`[channelSettings.js] Full settings for Control Channel ${selectedControlChannel}:`, getSettings(selectedControlChannel));
        
        captureSettings(selectedControlChannel);
        applySettings(selectedControlChannel, selectedControlChannel);
    });
});