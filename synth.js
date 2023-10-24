// synth.js
let channels = {}; // Object to hold multiple AudioContext and Oscillator instances

// Utility function to get or create a channel's context and oscillator
function getOrCreateChannel(channelNumber) {
    if (!channels[channelNumber]) {
        channels[channelNumber] = {
            context: new (window.AudioContext || window.webkitAudioContext)(),
            oscillator: null
        };
    }
    console.log(`[synth.js] Getting or creating channel: ${channelNumber}. Current channels:`, channels);
    return channels[channelNumber];
}

function playMS10TriangleBass(frequency = null, channelNumber = 1) { 
    // Default to channel 1 if not provided
    console.log(`[synth.js] playMS10TriangleBass called. Frequency: ${frequency}, Channel: ${channelNumber}`);
    
    let { context, oscillator } = getOrCreateChannel(channelNumber);
    
    if (oscillator) {
        console.log(`[synth.js] Stopping existing oscillator for channel: ${channelNumber}`);
        oscillator.stop();
        oscillator = null;
    }
    
    let osc = context.createOscillator(),
        gainNode = context.createGain(),
        filter = context.createBiquadFilter(),
        waveform = document.getElementById("waveform").value;
    
    console.log(`[synth.js] Oscillator type (waveform): ${waveform}`);
    
    osc.type = waveform;
    
    if (frequency === null) {
        frequency = parseFloat(document.getElementById("note").value);
        if (!isFinite(frequency)) {
            console.error("Invalid frequency value:", frequency);
            return;
        }
    }
    
    console.log(`[synth.js] Set oscillator frequency: ${frequency}`);
    
    osc.frequency.setValueAtTime(frequency, context.currentTime);
    
    let attack = document.getElementById("attack").value / 1000,
        release = document.getElementById("release").value / 1000,
        cutoff = document.getElementById("cutoff").value,
        resonance = document.getElementById("resonance").value;
    
    console.log(`[synth.js] Filter settings - Type: lowpass, Frequency: ${cutoff}, Resonance: ${resonance}`);
    
    filter.type = "lowpass";
    filter.frequency.value = cutoff;
    filter.Q.value = resonance;
    
    gainNode.gain.setValueAtTime(0, context.currentTime);
    const volume = getVolume();
    console.log(`[synth.js] Gain settings - Attack: ${attack}, Release: ${release}, Volume: ${volume}`);
    
    gainNode.gain.linearRampToValueAtTime(2 * volume, context.currentTime + attack);
    gainNode.gain.linearRampToValueAtTime(0, context.currentTime + attack + release);
    
    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(context.destination);
    
    osc.start();
    osc.stop(context.currentTime + attack + release);
    
    channels[channelNumber].oscillator = osc; 
}
