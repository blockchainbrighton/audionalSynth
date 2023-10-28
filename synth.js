// synth.js
let channels = {}; // Object to hold multiple AudioContext and Oscillator instances

class AudioChannel {
    constructor(channelNumber) {
        this.context = new (window.AudioContext || window.webkitAudioContext)();
        this.oscillator = null;
        this.gainNode = this.context.createGain();
        this.filter = this.context.createBiquadFilter();
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

    playSound(frequency, waveform, attack, release, cutoff, resonance, volume) {
        this.stopOscillator();

        let osc = this.createOscillator();
        osc.type = waveform;

        osc.frequency.setValueAtTime(frequency, this.context.currentTime);

        this.filter.type = "lowpass";
        this.filter.frequency.value = cutoff;
        this.filter.Q.value = resonance;

        this.gainNode.gain.setValueAtTime(0, this.context.currentTime);
        this.gainNode.gain.linearRampToValueAtTime(2 * volume, this.context.currentTime + attack);
        this.gainNode.gain.linearRampToValueAtTime(0, this.context.currentTime + attack + release);

        osc.connect(this.filter);
        this.filter.connect(this.gainNode);
        this.gainNode.connect(this.context.destination);

        osc.start();
        osc.stop(this.context.currentTime + attack + release);
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

    // Retrieve settings from the UI elements
    let waveform = document.getElementById("waveform").value;

    if (frequency === null) {
        frequency = parseFloat(document.getElementById("note").value);
        if (!isFinite(frequency)) {
            console.error("Invalid frequency value:", frequency);
            return;
        }
    }

    let attack = document.getElementById("attack").value / 1000,
        release = document.getElementById("release").value / 1000,
        cutoff = document.getElementById("cutoff").value,
        resonance = document.getElementById("resonance").value,
        volume = getVolume();

    console.log(`[PLAY] Frequency: ${frequency}, Channel: ${channelNumber}`);

    // Use the playSound method of AudioChannel
    channel.playSound(frequency, waveform, attack, release, cutoff, resonance, volume);
}

function getVolume() {
    // Placeholder for the actual volume calculation
    return 1; // Default volume
}
