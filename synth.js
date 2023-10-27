// synth.js
let channels = {}; // Object to hold multiple AudioContext and Oscillator instances

class AudioChannel {
    constructor(channelNumber) {
        this.context = new (window.AudioContext || window.webkitAudioContext)();
        this.oscillator = null;
        this.channelNumber = channelNumber;
    }

    createOscillator() {
        this.oscillator = this.context.createOscillator();
        return this.oscillator;
    }

    stopOscillator() {
        if (this.oscillator) {
            this.oscillator.stop();
            this.oscillator = null;
        }
    }
}

// Utility function to get or create a channel's context and oscillator
function getOrCreateChannel(channelNumber) {
    if (!channels[channelNumber]) {
        channels[channelNumber] = new AudioChannel(channelNumber);
    }
    return channels[channelNumber];
}

function playMS10TriangleBass(frequency = null, channelNumber = 1) { 
    let channel = getOrCreateChannel(channelNumber);
    
    channel.stopOscillator();
    
    let osc = channel.createOscillator(),
        gainNode = channel.context.createGain(),
        filter = channel.context.createBiquadFilter(),
        waveform = document.getElementById("waveform").value;
    
    osc.type = waveform;
    
    if (frequency === null) {
        frequency = parseFloat(document.getElementById("note").value);
        if (!isFinite(frequency)) {
            console.error("Invalid frequency value:", frequency);
            return;
        }
    }
    
    console.log(`[PLAY] Frequency: ${frequency}, Channel: ${channelNumber}`);
    
    osc.frequency.setValueAtTime(frequency, channel.context.currentTime);
    
    let attack = document.getElementById("attack").value / 1000,
        release = document.getElementById("release").value / 1000,
        cutoff = document.getElementById("cutoff").value,
        resonance = document.getElementById("resonance").value;
    
    filter.type = "lowpass";
    filter.frequency.value = cutoff;
    filter.Q.value = resonance;
    
    gainNode.gain.setValueAtTime(0, channel.context.currentTime);
    const volume = getVolume();
    gainNode.gain.linearRampToValueAtTime(2 * volume, channel.context.currentTime + attack);
    gainNode.gain.linearRampToValueAtTime(0, channel.context.currentTime + attack + release);
    
    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(channel.context.destination);
    
    osc.start();
    osc.stop(channel.context.currentTime + attack + release);
    
    channels[channelNumber].oscillator = osc; 
}

function getVolume() {
    // Placeholder for the actual volume calculation
    return 1; // Default volume
}
