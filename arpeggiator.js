// arpeggiator.js


class Arpeggiator {
    constructor() {
        this.isArpeggiatorOn = false;
        this.arpNotesByChannel = {
            '1': [], '2': [], '3': [], '4': [], '5': [], '6': [], '7': [], '8': [],
            '9': [], '10': [], '11': [], '12': [], '13': [], '14': [], '15': [], '16': []
        };
        this.allChannel = [];
        this.currentChannel = 'all';
        this.currentArpIndex = 0;
        this.arpTimeout = null;
        this.nudgeApplied = false;
        this.isNudgeActive = false;
        this.goingUp = true;
    }

    getSelectedChannel() {
        return this.currentChannel;
    }

    playNoteForChannel(channel, note) {
        if (channel === "all") {
            for (let channelNumber in this.arpNotesByChannel) {
                if (channelNumber !== "all") {
                    playMS10TriangleBass(note, channelNumber);
                }
            }
        } else {
            playMS10TriangleBass(note, Number(channel));
        }
    }

    playArpNotes() {
        const selectedChannel = this.getSelectedChannel();
        const currentNotesArray = this.arpNotesByChannel[selectedChannel];
        if (this.currentChannel === 'all') {
            this.arpNotesByChannel['all'] = [...this.allChannel];
        }

        if (this.isArpeggiatorOn && currentNotesArray.length > 0) {
            if (isExternalModeActive) return;

            if (currentNotesArray[this.currentArpIndex] !== null) {
                this.playNoteForChannel(selectedChannel, currentNotesArray[this.currentArpIndex]);
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

            let channel = getOrCreateChannel(selectedChannel === "all" ? 1 : Number(selectedChannel));
            let scheduledTime = channel.context.currentTime + baseInterval / 1000;

            this.arpTimeout = setTimeout(() => {
                this.nudgeApplied = false;
                this.playArpNotes();
            }, baseInterval);
        } else {
            console.log("[playArpNotes] Arpeggiator is off or arpNotes is empty.");
        }
        this.updateArpNotesDisplay();
    }

    // ... [Previous methods of the Arpeggiator class]

    updateAllChannel() {
        let currentAllChannel = [];
        for (let channel in this.arpNotesByChannel) {
            if (channel !== "all") {
                currentAllChannel = currentAllChannel.concat(this.arpNotesByChannel[channel]);
            }
        }

        this.allChannel = currentAllChannel.filter(note => !this.allChannel.includes(note) || currentAllChannel.includes(note));
    }

    startArpeggiator() {
        this.isArpeggiatorOn = true;
        this.playArpNotes();
    }

    stopArpeggiator() {
        this.isArpeggiatorOn = false;
        this.arpNotesByChannel[this.currentChannel].length = 0;
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
const arp = new Arpeggiator();
document.getElementById("playArp").addEventListener("click", () => arp.startArpeggiator());
document.getElementById("arpToggle").addEventListener("click", () => arp.toggleArpeggiator());