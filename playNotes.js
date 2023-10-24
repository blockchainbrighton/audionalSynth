// playNotes.js

function getSelectedChannel() {
    // Get the active control channel button
    const activeButton = document.querySelector('.control-channel-btn.active');
    return activeButton ? activeButton.getAttribute('data-control-channel-id') : 'all';
}

function playArpNotes() {
    let selectedChannel = getSelectedChannel();
    console.log("[playArpNotes] Function called.");
    console.log("[playArpNotes] Current arpNotes:", arp.arpNotesByChannel[selectedChannel]); // Use arp. prefix

    let currentNotesArray = arp.arpNotesByChannel[selectedChannel];

    if (arp.isArpeggiatorOn && currentNotesArray.length > 0) { // Use arp. prefix
      
        console.log("[playArpNotes] Arpeggiator is on and arpNotes are present.");

        if (isExternalModeActive) {
            console.log("[playArpNotes] isExternalModeActive value:", isExternalModeActive);
            return;
        }

        if (currentNotesArray[currentArpIndex] !== null) {
            console.log("[playArpNotes] Playing note at current index:", currentArpIndex, "Note:", currentNotesArray[currentArpIndex]);

            if (selectedChannel === "all") {
                // Handle "All Channels"
                for (let channelNumber in arpNotesByChannel) {
                    if (channelNumber !== "all") {
                        playMS10TriangleBass(currentNotesArray[currentArpIndex], channelNumber);
                    }
                }
            } else {
                // Handle a specific channel
                playMS10TriangleBass(currentNotesArray[currentArpIndex], Number(selectedChannel));
            }
        }

        let pattern = document.getElementById("arpPattern").value;
        console.log("[playArpNotes - pattern] Arpeggiator pattern:", pattern);
        console.log("[playArpNotes - arpPattern] Current arp pattern:", arpPattern);

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

        console.log("[playArpNotes] New arp index after pattern modification:", currentArpIndex);

        baseInterval = applySpeedModifier(baseInterval);
        console.log("[playArpNotes] Base interval after speed modifier (ms):", baseInterval);
        console.log("[playArpNotes] Current arp speed:", arpSpeed);
        let interval = baseInterval;

        // Overwrite BPM with Nudge if Nudge is active
        if (isNudgeActive) {
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

        arpTimeout = setTimeout(() => { // Use arp. prefix
            arp.nudgeApplied = false; // Use arp. prefix
            console.log("[playArpNotes] Timeout triggered. Calling playArpNotes again.");
            playArpNotes();
        }, interval);
    } else {
        console.log("[playArpNotes] Arpeggiator is off or arpNotes is empty.");
    }
    arp.updateArpNotesDisplay(); // Use arp. prefix
}