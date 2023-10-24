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
        this.playArpeggiator = this.playArpeggiator.bind(this);
        this.arpTimeout = null;
        this.nudgeApplied = false;
        this.isNudgeActive = false;
        this.goingUp = true;
    }

    // Method to update the 'all' channel based on the notes in the individual channels
    updateAllChannel() {
        this.allChannel = [];
        for (let channel in this.arpNotesByChannel) {
            if (channel !== "all") {
                this.allChannel = this.allChannel.concat(this.arpNotesByChannel[channel]);
            }
        }
    }
    

    startArpeggiator() {
        this.isArpeggiatorOn = true;
        playArpNotes(); // Assuming playArpNotes is still a global function
    }

    playArpeggiator() {
        this.startArpeggiator();
    }

    stopArpeggiator() {
        this.isArpeggiatorOn = false;
        this.arpNotesByChannel[this.currentChannel].length = 0;
    }

    applySpeedModifier(baseInterval) {
        let arpSpeed = document.getElementById("arpSpeed").value;

        switch (arpSpeed) {
            case 'normal':
                return baseInterval;
            case 'double-time':
                return baseInterval / 2;
            case 'half-time':
                return baseInterval * 2;
            case 'quadruple-time':
                return baseInterval / 4;
            case 'octuple-time':
                return baseInterval / 8;
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
        if (this.goingUp) {
            this.incrementArpIndex();
            if (this.currentArpIndex === this.arpNotesByChannel[this.currentChannel].length - 1) {
                this.goingUp = false;
            }
        } else {
            this.decrementArpIndex();
            if (this.currentArpIndex === 0) {
                this.goingUp = true;
            }
        }
    }

    doubleStepArpIndex() {
        this.currentArpIndex = (this.currentArpIndex + 2) % this.arpNotesByChannel[this.currentChannel].length;
    }

    randomWithRestsArpIndex() {
        if (Math.random() > 0.8) {
            return;
        }
        this.randomizeArpIndex();
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
    
        const columns = 16;
        const noteWidth = ctx.measureText("W#").width;
        const spacing = noteWidth + 7;
        let x = 10;
        let y = 30;
        let currentColumn = 0;
    
        // Only display notes for the current channel
        const currentChannelNotes = this.arpNotesByChannel[this.currentChannel] || [];
        console.log("[updateArpNotesDisplay] Current channel:", this.currentChannel);
        console.log("[updateArpNotesDisplay] Notes for current channel:", currentChannelNotes);
    
        currentChannelNotes.forEach(note => {
            let noteText = note !== null ? frequencyToNoteName(note) : "Rest";
    
            if (x + spacing > canvas.width) {
                currentColumn = 0;
                x = 10;
                y += 30;
            }
    
            ctx.fillText(noteText, x, y);
    
            console.log("[updateArpNotesDisplay] Note added at position:", x, y, noteText);
    
            currentColumn++;
            if (currentColumn >= columns) {
                currentColumn = 0;
                x = 10;
                y += 30;
            } else {
                x += spacing;
            }
        });
    }
    

    toggleArpeggiator() {
        const btn = document.getElementById("arpToggle");
        if (this.isArpeggiatorOn) {
            btn.innerText = "Start Arpeggiator";
            this.stopArpeggiator();
        } else {
            btn.innerText = "Stop Arpeggiator";
            this.startArpeggiator();
        }
    }
}

// Create an instance of the Arpeggiator class
const arp = new Arpeggiator();
document.getElementById("playArp").addEventListener("click", arp.playArpeggiator);

// Bind the toggleArpeggiator method to the arp instance
document.getElementById("arpToggle").addEventListener("click", arp.toggleArpeggiator.bind(arp));
