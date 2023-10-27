// ArpeggiatorCore.js

class ArpeggiatorCore {
    constructor() {
        this.isArpeggiatorOn = false;
        this.arpNotesByChannel = {
            '1': [], '2': [], '3': [], '4': [], '5': [], '6': [], '7': [], '8': [],
            '9': [], '10': [], '11': [], '12': [], '13': [], '14': [], '15': [], '16': []
        };
        this.currentChannel = 'all';
        this.currentArpIndex = 0;
        this.arpTimeout = null;
        this.nudgeApplied = false;
        this.isNudgeActive = false;
        this.goingUp = true;
    }

    playNoteForChannel(channel, note) {
        if (channel === "all") {
            for (let channelNumber in this.arpNotesByChannel) {
                if (channelNumber !== "all") {
                    // Fetch the settings for the specific channel using getSettings
                    let selectedChannelSettings = getSettings(channelNumber);
                    
                    // Apply the channel settings to the synthesizer
                    applySynthSettings(selectedChannelSettings, channelNumber);
                    
                    // Play the note with the applied settings
                    playMS10TriangleBass(note, channelNumber);
                }
            }
        } else {
            playMS10TriangleBass(note, Number(channel));
        }
    }

    playArpNotes(channels = []) {
        if (!Array.isArray(channels) || channels.length === 0) {
            console.error("Invalid channels provided to playArpNotes.");
            return;
        }

        channels.forEach(channel => {
            const currentNotesArray = this.arpNotesByChannel[channel];

            if (!this.isArpeggiatorOn) {
                return;
            }

            if (currentNotesArray.length === 0) {
                return;
            }

            if (currentNotesArray[this.currentArpIndex] !== null) {
                this.playNoteForChannel(channel, currentNotesArray[this.currentArpIndex]);
            }

            this.updateArpIndexBasedOnPattern(channel);
            this.scheduleNextArpNote(channel);
        });
    }

    updateArpIndexBasedOnPattern(channel) {
        let pattern = document.getElementById("arpPattern").value;

        switch (pattern) {
            case 'up':
                this.incrementArpIndex(channel);
                break;
            case 'down':
                this.decrementArpIndex(channel);
                break;
            case 'random':
                this.randomizeArpIndex(channel);
                break;
            case 'up-down':
                this.upDownArpIndex(channel);
                break;
            case 'double-step':
                this.doubleStepArpIndex(channel);
                break;
            case 'random-rest':
                this.randomWithRestsArpIndex(channel);
                break;
            default:
                console.error("Unknown arpeggiator pattern:", pattern);
        }
    }

    scheduleNextArpNote(channel) {
        let baseInterval = 60 / parseFloat(document.getElementById("arpTempo").value) * 1000;
        baseInterval = this.applySpeedModifier(baseInterval);

        if (this.isNudgeActive) {
            let timingAdjustValue = parseFloat(document.getElementById("timingAdjust").value) / 100;
            baseInterval *= (1 - timingAdjustValue);
        }

        this.arpTimeout = setTimeout(() => {
            this.playArpNotes([channel]);
        }, baseInterval);
    }

    updateAllChannel() {
        this.allChannel = [];
        for (let channel in this.arpNotesByChannel) {
            if (channel !== "all") {
                this.allChannel.push([...this.arpNotesByChannel[channel]]);
            }
        }
    }

    startArpeggiator() {
        this.isArpeggiatorOn = true;
        const channels = Object.keys(this.arpNotesByChannel).filter(channel => channel !== "all");
        this.playArpNotes(channels);
    }
    

    stopArpeggiator() {
        this.isArpeggiatorOn = false;
        if (this.arpNotesByChannel[this.currentChannel]) {
            this.arpNotesByChannel[this.currentChannel].length = 0;
        } else {
            console.error(`ArpeggiatorCore: Channel '${this.currentChannel}' not found in arpNotesByChannel.`);
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

    toggleArpeggiator() {
        this.isArpeggiatorOn ? this.stopArpeggiator() : this.startArpeggiator();
        document.getElementById("arpToggle").innerText = this.isArpeggiatorOn ? "Stop Arpeggiator" : "Start Arpeggiator";
    }

    pauseArpeggiator() {
        clearTimeout(this.arpTimeout);
        this.isArpeggiatorOn = false;
    }

    resetTimingAdjust() {
        document.getElementById("timingAdjust").value = 0;
    }

}

