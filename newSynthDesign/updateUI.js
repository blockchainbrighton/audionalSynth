// updateUI.js

// Assuming synthSettings is imported or available globally
// import { synthSettings } from './synthSettingsMaster.js';

function updateUI() {
    const currentChannel = synthSettings.currentChannel;
    const channelSettings = synthSettings.channelSettings[`channel${currentChannel}`];

    // Update oscillator type
    document.getElementById('oscillatorType').value = channelSettings.oscillatorType;

    // Update filter type
    document.getElementById('filterType').value = channelSettings.filterType;

    // Update ADSR envelope
    document.getElementById('attack').value = channelSettings.adsrEnvelope.attack;
    document.getElementById('decay').value = channelSettings.adsrEnvelope.decay;
    document.getElementById('sustain').value = channelSettings.adsrEnvelope.sustain;
    document.getElementById('release').value = channelSettings.adsrEnvelope.release;

    // Update effect type
    document.getElementById('effectType').value = channelSettings.effectType;

    // Update arpeggiator settings
    document.getElementById('arpToggle').checked = channelSettings.arpeggiator.isEnabled;
    document.getElementById('arpPattern').value = channelSettings.arpeggiator.pattern;
    document.getElementById('arpTempo').value = channelSettings.arpeggiator.tempo;
    document.getElementById('arpLength').value = channelSettings.arpeggiator.length;
    document.getElementById('arpSpeed').value = channelSettings.arpeggiator.speed;

    // Update UI for note arrays (Arpeggiator steps)
    const noteArray = synthSettings.arpNoteArrays[`channel${currentChannel}`];
    noteArray.forEach((note, index) => {
        const stepElement = document.querySelector(`.step[data-step="${index + 1}"]`);
        if (stepElement) {
            stepElement.classList.toggle('has-note', !!note);
            stepElement.textContent = note || '';
        }
    });
}

// Call updateUI when a new channel is loaded or settings are changed
// updateUI();

// Export updateUI if needed
// export { updateUI };
