// channelSettings.js

const channelSettings = {
    'all': {
        waveform: 'defaultWaveform',
        note: 'defaultNote',
        // ... other default settings
    },
    '1': {
        waveform: 'defaultWaveform',
        note: 'defaultNote',
        // ... other default settings
    },
    // ... similar structure for other channels
};
function captureSettings(instanceId) {
    const container = document.querySelector(`[data-synth-instance-id="${instanceId}"]`);
    
    const controlChannel = container.querySelector('#controlChannel').value;
    const waveform = container.querySelector('#waveform').value;
    const note = container.querySelector('#note').value;
    const attack = container.querySelector('#attack').value;
    const release = container.querySelector('#release').value;
    const cutoff = container.querySelector('#cutoff').value;
    const resonance = container.querySelector('#resonance').value;
    const volume = container.querySelector('#volume').value;
    const arpPattern = container.querySelector('#arpPattern').value;
    const arpSpeed = container.querySelector('#arpSpeed').value;
    const arpTempo = container.querySelector('#arpTempo').value;
    const bpmAdjustValue = container.querySelector('#bpmAdjustValue').value;
    const timingAdjust = container.querySelector('#timingAdjust').value;
    const useSequencerTiming = container.querySelector('#useSequencerTiming').checked;

    channelSettings[controlChannel] = {
        waveform,
        note,
        attack,
        release,
        cutoff,
        resonance,
        volume,
        arpPattern,
        arpSpeed,
        arpTempo,
        bpmAdjustValue,
        timingAdjust,
        useSequencerTiming
    };
}

function getSettings(controlChannel) {
    return channelSettings[controlChannel];
}

function applySettings(instanceId, controlChannel) {
    const settings = getSettings(controlChannel);
    const container = document.querySelector(`[data-synth-instance-id="${instanceId}"]`);
    
    container.querySelector('#waveform').value = settings.waveform;
    container.querySelector('#note').value = settings.note;
    container.querySelector('#attack').value = settings.attack;
    container.querySelector('#release').value = settings.release;
    container.querySelector('#cutoff').value = settings.cutoff;
    container.querySelector('#resonance').value = settings.resonance;
    container.querySelector('#volume').value = settings.volume;
    container.querySelector('#arpPattern').value = settings.arpPattern;
    container.querySelector('#arpSpeed').value = settings.arpSpeed;
    container.querySelector('#arpTempo').value = settings.arpTempo;
    container.querySelector('#bpmAdjustValue').value = settings.bpmAdjustValue;
    container.querySelector('#timingAdjust').value = settings.timingAdjust;
    container.querySelector('#useSequencerTiming').checked = settings.useSequencerTiming;
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
    applySettings(instanceId, selectedControlChannel);
});