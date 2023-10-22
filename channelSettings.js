// channelSettings.js

const channelSettings = {
    all: getDefaultSettings() // Default settings for "all" control channel
};

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

function captureSettings(instanceId) {    const container = document.querySelector(`[data-synth-instance-id="${instanceId}"]`);
    
    const settings = {
        waveform: container.querySelector('#waveform').value,
        note: container.querySelector('#note').value,
        attack: container.querySelector('#attack').value,
        release: container.querySelector('#release').value,
        cutoff: container.querySelector('#cutoff').value,
        resonance: container.querySelector('#resonance').value,
        volume: container.querySelector('#volume').value,
        arpPattern: container.querySelector('#arpPattern').value,
        arpSpeed: container.querySelector('#arpSpeed').value,
        arpTempo: container.querySelector('#arpTempo').value,
        bpmAdjustValue: container.querySelector('#bpmAdjustValue').value,
        timingAdjust: container.querySelector('#timingAdjust').value,
        useSequencerTiming: container.querySelector('#useSequencerTiming').checked
        
    };



    const controlChannel = container.querySelector('#controlChannel').value;
    if (!channelSettings[controlChannel]) {
        channelSettings[controlChannel] = getDefaultSettings();
    }
    channelSettings[controlChannel] = { ...channelSettings[controlChannel], ...settings };
}

function getSettings(controlChannel) {
    if (!channelSettings[controlChannel]) {
        console.warn(`[channelSettings.js] Using default settings for Control Channel ${controlChannel} as specific settings were not found.`);
        return getDefaultSettings();
    }
    console.log(`[channelSettings.js] Retrieved settings for Control Channel ${controlChannel}:`, channelSettings[controlChannel]);
    return channelSettings[controlChannel];
}


function applySettings(instanceId, controlChannel) {
    const settings = getSettings(controlChannel);
    const container = document.querySelector(`[data-synth-instance-id="${instanceId}"]`);
    
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
    console.log(`[channelSettings.js] Applied settings for instanceId ${instanceId}, Control Channel ${controlChannel}:`, settings);
}



// Attach event listeners to update channelSettings in real-time
document.addEventListener('change', function(e) {
    const element = e.target;
    const instanceId = element.closest('[data-synth-instance-id]').getAttribute('data-synth-instance-id');
    captureSettings(instanceId);
});

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the UI with default settings for the selected control channel
    const defaultControlChannel = document.querySelector('#controlChannel').value;
    applySettings(1, defaultControlChannel); // Assuming instanceId is 1 for simplicity
});

document.getElementById("controlChannel").addEventListener('change', function(e) {
    const instanceId = e.target.closest('[data-synth-instance-id]').getAttribute('data-synth-instance-id');
    const selectedControlChannel = e.target.value;
    
    // Log the entire current settings for the current channel
    console.log(`[channelSettins.js] Full settings for Control Channel ${selectedControlChannel}:`, getSettings(selectedControlChannel));
    
    applySettings(instanceId, selectedControlChannel);
});
