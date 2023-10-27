// ArpeggiatorUI.js

class ArpeggiatorUI {
    constructor() {
        this.arpCore = new ArpeggiatorCore();
        this.currentChannel = '1';
        this.allChannel = [];
        this.arpNotesByChannel = {}; // Initialize arpNotesByChannel as an empty object

        // Initialize all channels including 'all'
        for (let i = 1; i <= 16; i++) {
            this.arpNotesByChannel[i.toString()] = [];
        }
        this.arpNotesByChannel['all'] = [];

        this.updateChannelHeading();
        // this.bindEvents();
    }

    bindEvents() {
        document.getElementById("playArp").addEventListener("click", () => {
            console.log("[ArpeggiatorUI] playArp button pressed");
            this.arpCore.startArpeggiator();
        });
        document.getElementById("arpToggle").addEventListener("click", () => this.toggleArpeggiator());
        // Bind additional events as needed
    }
    
    toggleArpeggiator() {
        this.arpCore.isArpeggiatorOn ? this.arpCore.stopArpeggiator() : this.arpCore.startArpeggiator();
        document.getElementById("arpToggle").innerText = this.arpCore.isArpeggiatorOn ? "Stop Arpeggiator" : "Start Arpeggiator";
    }

     // Call this method whenever the current channel changes
     setCurrentChannel(channel) {
        this.currentChannel = channel;
        this.updateChannelHeading();
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

    updateArpNotesDisplay() {
        const canvas = document.getElementById("arpNotesDisplay");
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = "bold 11px Arial";
        ctx.fillStyle = "#FFFFFF";
    
        const spacing = ctx.measureText("W#").width + 7;
        let x = 10;
        let y = 30;
    
        const currentChannelNotes = this.arpCore.arpNotesByChannel[this.currentChannel] || [];
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
    

    updateAllChannel() {
        this.allChannel = [];
        for (let channel in this.arpCore.arpNotesByChannel) {
            if (channel !== "all") {
                this.allChannel.push([...this.arpCore.arpNotesByChannel[channel]]);
            }
        }
    }

}

// Create an instance of the ArpeggiatorUI class
const arpUI = new ArpeggiatorUI();
arpUI.setCurrentChannel('1'); // This will update the heading to "Channel 1 Arp Array"

// Bind event listeners directly
document.getElementById("playArp").addEventListener("click", () => {
    console.log("[Arpeggiator] playArp button pressed");
    arpUI.arpCore.startArpeggiator();
});
document.getElementById("arpToggle").addEventListener("click", () => arpUI.toggleArpeggiator());
