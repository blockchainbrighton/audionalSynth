// playNotes.js

function getSelectedChannel() {
    // Get the active control channel button
    const activeButton = document.querySelector('.control-channel-btn.active');
    return activeButton ? activeButton.getAttribute('data-control-channel-id') : 'all';
}


function playArpNotes() {
            console.log("[playArpNotes] Function called.");

            let selectedChannel = getSelectedChannel();


            if (isArpeggiatorOn && arpNotes.length > 0) {
                console.log("[playArpNotes] Arpeggiator is on and arpNotes are present.");

                if (isExternalModeActive) {
                    // If we're in external mode, don't reschedule the next note 
                    // unless a new step is received
                    console.log("[playArpNotes] isExternalModeActive value:", isExternalModeActive);
                    return;
                }
                
                if (arpNotes[currentArpIndex] !== null) {
                    console.log("[playArpNotes] Playing note at current index:", currentArpIndex, "Note:", arpNotes[currentArpIndex]);
                    
                    
                    if (selectedChannel === "all") {
                        // Handle "All Channels"
                        for (let channelNumber in channels) {
                            playMS10TriangleBass(arpNotes[currentArpIndex], channelNumber);
                        }
                    } else {
                        // Handle a specific channel
                        playMS10TriangleBass(arpNotes[currentArpIndex], Number(selectedChannel));
                    }
                                    }

                let pattern = document.getElementById("arpPattern").value;
                console.log("[playArpNotes] Arpeggiator pattern:", pattern);

                let baseInterval = 60 / parseFloat(document.getElementById("arpTempo").value) * 1000;
                console.log("[playArpNotes] Base interval (ms):", baseInterval);

                switch(pattern) {
                    case 'up':
                        incrementArpIndex();
                        break;
                    case 'down':
                        decrementArpIndex();
                        break;
                    case 'random':
                        randomizeArpIndex();
                        break;
                    case 'up-down':
                        upDownArpIndex();
                        break;
                    case 'double-step':
                        doubleStepArpIndex();
                        break;
                    case 'random-rest':
                        randomWithRestsArpIndex();
                        break;
                    default:
                        console.error("Unknown arpeggiator pattern:", pattern);
                }

                console.log("[playArpNotes] New arp index after pattern modification:", currentArpIndex);

                baseInterval = applySpeedModifier(baseInterval);
                console.log("[playArpNotes] Base interval after speed modifier (ms):", baseInterval);

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

                arpTimeout = setTimeout(() => {
                    nudgeApplied = false;
                    console.log("[playArpNotes] Timeout triggered. Calling playArpNotes again.");
                    playArpNotes();
                }, interval);
            } else {
                console.log("[playArpNotes] Arpeggiator is off or arpNotes is empty.");
            }
            updateArpNotesDisplay();
        }
