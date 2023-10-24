// playNotes.js

function getSelectedChannel() {
    // Use the currentChannel property from the Arpeggiator instance
    const selectedChannel = arp.currentChannel;
    console.log("[getSelectedChannel] Selected Channel:", selectedChannel);
    return selectedChannel;
}

function playNoteForChannel(channel, note) {
    if (channel === "all") {
        // Play the note for all channels
        for (let channelNumber in arp.arpNotesByChannel) {
            if (channelNumber !== "all") {
                playMS10TriangleBass(note, channelNumber);
            }
        }
    } else {
        playMS10TriangleBass(note, Number(channel));
    }
}

function playArpNotes() {
    console.log("[playArpNotes] allChannel at start:", arp.allChannel);
    const selectedChannel = getSelectedChannel();
    console.log("[playArpNotes] Function called.");
    console.log("[playArpNotes] Current arpNotes:", arp.arpNotesByChannel[selectedChannel]);

    const currentNotesArray = arp.arpNotesByChannel[selectedChannel];
    if (this.currentChannel === 'all') {
        this.arpNotesByChannel['all'] = [...this.allChannel];
    }
    console.log("[playArpNotes] Synchronized arpNotes for all channel:", this.arpNotesByChannel['all']);

    if (arp.isArpeggiatorOn && currentNotesArray.length > 0) {
        console.log("[playArpNotes] Arpeggiator is on and arpNotes are present.");

        if (isExternalModeActive) {
            console.log("[playArpNotes] isExternalModeActive value:", isExternalModeActive);
            return;
        }

        if (currentNotesArray[arp.currentArpIndex] !== null) {
            console.log("[playArpNotes] Playing note at current index:", arp.currentArpIndex, "Note:", currentNotesArray[arp.currentArpIndex]);
            playNoteForChannel(selectedChannel, currentNotesArray[arp.currentArpIndex]);
        }

        let pattern = document.getElementById("arpPattern").value;
        console.log("[playArpNotes - pattern] Arpeggiator pattern:", pattern);

        let baseInterval = 60 / parseFloat(document.getElementById("arpTempo").value) * 1000;
        console.log("[playArpNotes] Base interval (ms):", baseInterval);

        switch (pattern) {
            case 'up':
                arp.incrementArpIndex(); // Use arp. prefix
                break;
            case 'down':
                arp.decrementArpIndex(); // Use arp. prefix
                break;
            case 'random':
                arp.randomizeArpIndex(); // Use arp. prefix
                break;
            case 'up-down':
                arp.upDownArpIndex(); // Use arp. prefix
                break;
            case 'double-step':
                arp.doubleStepArpIndex(); // Use arp. prefix
                break;
            case 'random-rest':
                arp.randomWithRestsArpIndex(); // Use arp. prefix
                break;
            default:
                console.error("Unknown arpeggiator pattern:", pattern);
        }

        console.log("[playArpNotes] New arp index after pattern modification:", arp.currentArpIndex);

        baseInterval = arp.applySpeedModifier(baseInterval);
        console.log("[playArpNotes] Base interval after speed modifier (ms):", baseInterval);
        console.log("[playArpNotes] Current arp speed:", arp.arpSpeed);
        let interval = baseInterval;

        // Overwrite BPM with Nudge if Nudge is active
        if (arp.isNudgeActive) {
            let timingAdjustValue = parseFloat(document.getElementById("timingAdjust").value) / 100;
            const adjustmentMultiplier = 1 - timingAdjustValue;
            baseInterval *= adjustmentMultiplier;
            console.log("[playArpNotes] Adjusted interval due to active nudge (ms):", baseInterval);
        }

        // Use context (AudioContext) to schedule the next call
        let channel = getOrCreateChannel(selectedChannel === "all" ? 1 : Number(selectedChannel));
        console.log("[playArpNotes] Selected Channel:", selectedChannel);

        let scheduledTime = channel.context.currentTime + interval / 1000; // Convert to seconds                
        console.log("[playArpNotes] Scheduled time (in context time):", scheduledTime);

        arp.arpTimeout = setTimeout(() => { // Use arp. prefix
            arp.nudgeApplied = false; // Use arp. prefix
            console.log("[playArpNotes] Timeout triggered. Calling playArpNotes again.");
            playArpNotes();
        }, interval);
    } else {
        console.log("[playArpNotes] Arpeggiator is off or arpNotes is empty.");
    }
    arp.updateArpNotesDisplay();
}