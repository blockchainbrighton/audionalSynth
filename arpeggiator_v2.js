// arpeggiator_v2.js

// arpeggiator.js


class Arpeggiator {
    constructor() {
        this.isArpeggiatorOn = false;
        this.arpNotesByChannel = {
            '1': [], '2': [], '3': [], '4': [], '5': [], '6': [], '7': [], '8': [],
            '9': [], '10': [], '11': [], '12': [], '13': [], '14': [], '15': [], '16': []
        };
        this.allChannel = [];
        this.channelSettings = {}; // Object to store settings for each channel
        this.currentChannel = 'all';
        this.updateChannelHeading(); // Call this method to initially set the heading
        this.currentArpIndex = 0;
        this.arpTimeout = null;
        this.nudgeApplied = false;
        this.isNudgeActive = false;
        this.goingUp = true;
        this.playArpNotes = this.playArpNotes.bind(this);

    }

    getSelectedChannel() {
        return this.currentChannel;
    }

    updateChannelHeading() {
        const channelHeading = document.getElementById('channelHeading');
        if (channelHeading) {
            channelHeading.textContent = `Channel ${this.currentChannel} Arp Array`;
        }
    }

    // Call this method whenever the current channel changes
    setCurrentChannel(channel) {
        this.currentChannel = channel;
        this.updateChannelHeading();
    }


    playNoteForChannel(channel, note) {
        if (channel === "all") {
            for (let channelNumber in this.arpNotesByChannel) {
                if (channelNumber !== "all") {
                    // Set the current channel to the specific channelNumber
                    this.currentChannel = channelNumber;
                    
                    // Fetch the settings for the specific channel using getSettings
                    let selectedChannelSettings = getSettings(channelNumber);
                    
                    // Apply the channel settings to the synthesizer
                    applySynthSettings(selectedChannelSettings);
                    
                    // Play the note with the applied settings
                    playMS10TriangleBass(note, channelNumber);
                    
                    // Reset the settings to default or previous state if needed
                    // This step might be optional depending on how applySynthSettings works
                    resetSynthSettings();
                }
            }
            // Reset the currentChannel to 'all' after processing all channels
            this.currentChannel = 'all';
        } else {
            playMS10TriangleBass(note, Number(channel));
        }
    }
    
    
   applySynthSettings(settings, channelNumber) {
        // Assuming there's a global synth object or a function to get the synth for a specific channel
        const synth = getSynthForChannel(channelNumber); // This function needs to be defined based on your setup
    
        // Set the synthesizer parameters based on the settings
        synth.setWaveform(settings.waveform);
        synth.setAttack(Number(settings.attack));
        synth.setRelease(Number(settings.release));
        synth.setCutoff(Number(settings.cutoff));
        synth.setResonance(Number(settings.resonance));
        synth.setVolume(Number(settings.volume));
        synth.setArpPattern(settings.arpPattern);
        synth.setArpSpeed(settings.arpSpeed);
        synth.setArpTempo(Number(settings.arpTempo));
        synth.setBpmAdjustValue(Number(settings.bpmAdjustValue));
        synth.setTimingAdjust(Number(settings.timingAdjust));
        synth.setUseSequencerTiming(settings.useSequencerTiming);
    
        // If there are other settings that need to be applied to the synth, add them here
    }
    
    // Implementing applyArpeggiatorSettingsToChannel
    applyArpeggiatorSettingsToChannel(channel, settings) {
        this.channelSettings[channel] = settings;
        this.applySynthSettings(settings, channel);
    }

   // Refactored playArpNotes
playArpNotes(channels = []) {
    // Logging the channels data
    console.log("Received channels:", channels);

    if (!Array.isArray(channels) || channels.length === 0) {
        console.error("Invalid channels provided to playArpNotes.");
        return;
    }

    channels.forEach(channel => {
        const currentNotesArray = this.arpNotesByChannel[channel];

        if (!this.isArpeggiatorOn) {
            this.updateArpNotesDisplay();
            return;
        }

        if (currentNotesArray.length === 0) {
            this.updateArpNotesDisplay();
            return;
        }

        // Apply settings for the current channel
        const settings = this.channelSettings[channel];
        if (settings) {
            this.applyArpeggiatorSettingsToChannel(channel, settings);
        }

        if (currentNotesArray[this.currentArpIndex] !== null) {
            this.playNoteForChannel(channel, currentNotesArray[this.currentArpIndex]);
        }

        let pattern = document.getElementById("arpPattern").value;
        let baseInterval = 60 / parseFloat(document.getElementById("arpTempo").value) * 1000;

        switch (pattern) {
            case 'up':
                this.incrementArpIndex();
                break;
            case 'down':
                this.decrementArpIndex();
                break;
            case 'random':
                this.randomizeArpIndex();
                break;
            case 'up-down':
                this.upDownArpIndex();
                break;
            case 'double-step':
                this.doubleStepArpIndex();
                break;
            case 'random-rest':
                this.randomWithRestsArpIndex();
                break;
            default:
                console.error("Unknown arpeggiator pattern:", pattern);
        }

        baseInterval = this.applySpeedModifier(baseInterval);

        if (this.isNudgeActive) {
            let timingAdjustValue = parseFloat(document.getElementById("timingAdjust").value) / 100;
            const adjustmentMultiplier = 1 - timingAdjustValue;
            baseInterval *= adjustmentMultiplier;
        }

        this.arpTimeout = setTimeout(() => {
            this.playArpNotes([channel]);
        }, baseInterval);

        this.updateArpNotesDisplay();
    });
}

    


    updateAllChannel() {
        this.allChannel = [];
        for (let channel in this.arpNotesByChannel) {
            if (channel !== "all") {
                this.allChannel.push([...this.arpNotesByChannel[channel]]);
            }
        }
    }

    // Refactored startArpeggiator to consider individual channel settings
    startArpeggiator() {
        this.isArpeggiatorOn = true;
        const channels = Object.keys(this.arpNotesByChannel).filter(channel => channel !== "all");
        channels.forEach(channel => {
            const settings = this.channelSettings[channel];
            if (settings) {
                this.applyArpeggiatorSettingsToChannel(channel, settings);
            }
        });
        this.playArpNotes(channels);
    }

    // Refactored stopArpeggiator to consider individual channel settings
    stopArpeggiator(channel) {
        if (channel) {
            this.arpNotesByChannel[channel].length = 0;
        } else {
            this.isArpeggiatorOn = false;
            Object.keys(this.arpNotesByChannel).forEach(ch => {
                this.arpNotesByChannel[ch].length = 0;
            });
        }
    }

    applySpeedModifier(baseInterval) {
        const arpSpeed = document.getElementById("arpSpeed").value;
        switch (arpSpeed) {
            case 'normal': return baseInterval;
            case 'double-time': return baseInterval / 2;
            case 'half-time': return baseInterval * 2;
            case 'quadruple-time': return baseInterval / 4;
            case 'octuple-time': return baseInterval / 8;
            default:
                console.error("Unknown speed setting:", arpSpeed);
                return baseInterval;
        }
    }

    incrementArpIndex() {
        this.currentArpIndex = (this.currentArpIndex + 1) % this.arpNotesByChannel[this.currentChannel].length;
    }

    decrementArpIndex() {
        this.currentArpIndex = (this.currentArpIndex - 1 + this.arpNotesByChannel[this.currentChannel].length) % this.arpNotesByChannel[this.currentChannel].length;
    }

    randomizeArpIndex() {
        this.currentArpIndex = Math.floor(Math.random() * this.arpNotesByChannel[this.currentChannel].length);
    }

    upDownArpIndex() {
        this.goingUp ? this.incrementArpIndex() : this.decrementArpIndex();
        if (this.currentArpIndex === 0 || this.currentArpIndex === this.arpNotesByChannel[this.currentChannel].length - 1) {
            this.goingUp = !this.goingUp;
        }
    }

    doubleStepArpIndex() {
        this.currentArpIndex = (this.currentArpIndex + 2) % this.arpNotesByChannel[this.currentChannel].length;
    }

    randomWithRestsArpIndex() {
        if (Math.random() <= 0.8) {
            this.randomizeArpIndex();
        }
    }

    // Refactored toggleArpeggiator to consider individual channel settings
    toggleArpeggiator(channel) {
        if (channel) {
            if (this.arpNotesByChannel[channel].length > 0) {
                this.stopArpeggiator(channel);
            } else {
                this.startArpeggiator();
            }
        } else {
            this.isArpeggiatorOn ? this.stopArpeggiator() : this.startArpeggiator();
        }
        document.getElementById("arpToggle").innerText = this.isArpeggiatorOn ? "Stop Arpeggiator" : "Start Arpeggiator";
    }

    pauseArpeggiator() {
        clearTimeout(this.arpTimeout);
        this.isArpeggiatorOn = false;
    }

    resetTimingAdjust() {
        document.getElementById("timingAdjust").value = 0;
    }

    updateArpNotesDisplay() {
        const canvas = document.getElementById("arpNotesDisplay");
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = "bold 11px Arial";
        ctx.fillStyle = "#FFFFFF";

        const spacing = ctx.measureText("W#").width + 7;
        let x = 10;
        let y = 30;

        const currentChannelNotes = this.arpNotesByChannel[this.currentChannel] || [];
        currentChannelNotes.forEach(note => {
            const noteText = note !== null ? frequencyToNoteName(note) : "Rest";
            if (x + spacing > canvas.width) {
                x = 10;
                y += 30;
            }
            ctx.fillText(noteText, x, y);
            x += spacing;
        });
        this.updateAllChannel();
    }

}

// Create an instance of the Arpeggiator class
const arpUI = new Arpeggiator();
arpUI.setCurrentChannel('1'); // This will update the heading to "Channel 1 Arp Array"
document.getElementById("playArp").addEventListener("click", () => arpUI.startArpeggiator());
document.getElementById("arpToggle").addEventListener("click", () => arpUI.toggleArpeggiator());