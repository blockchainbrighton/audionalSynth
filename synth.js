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
    return channels[channelNumber];
}

function playMS10TriangleBass(frequency = null, channelNumber = 1) { 
    // Default to channel 1 if not provided
    let { context, oscillator } = getOrCreateChannel(channelNumber);
    
    if (oscillator) {
        oscillator.stop();
        oscillator = null;
    }
    
    let osc = context.createOscillator(),
        gainNode = context.createGain(),
        filter = context.createBiquadFilter(),
        waveform = document.getElementById("waveform").value;
    
    osc.type = waveform;
    
    if (frequency === null) {
        frequency = parseFloat(document.getElementById("note").value);
        if (!isFinite(frequency)) {
            console.error("Invalid frequency value:", frequency);
            return;
        }
    }
    
    // Log the frequency and its channel
    console.log(`[PLAY] Frequency: ${frequency}, Channel: ${channelNumber}`);
    
    osc.frequency.setValueAtTime(frequency, context.currentTime);
    
    let attack = document.getElementById("attack").value / 1000,
        release = document.getElementById("release").value / 1000,
        cutoff = document.getElementById("cutoff").value,
        resonance = document.getElementById("resonance").value;
    
    filter.type = "lowpass";
    filter.frequency.value = cutoff;
    filter.Q.value = resonance;
    
    gainNode.gain.setValueAtTime(0, context.currentTime);
    const volume = getVolume();
    gainNode.gain.linearRampToValueAtTime(2 * volume, context.currentTime + attack);
    gainNode.gain.linearRampToValueAtTime(0, context.currentTime + attack + release);
    
    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(context.destination);
    
    osc.start();
    osc.stop(context.currentTime + attack + release);
    
    channels[channelNumber].oscillator = osc; 
}

