 // eventListeners.js
        // Assign the playArp function to the button
        document.getElementById("playArp").addEventListener("click", playArpeggiator);
        document.getElementById("pauseArp").addEventListener("click", pauseArpeggiator);

       




        const sequencerChannel = new BroadcastChannel('sequencerChannel');

        sequencerChannel.addEventListener("message", (event) => {
            if (event.data.type === 'step') {
                console.log(`[ms10 messageEventListener] Received step: ${event.data.data.step}`);
                onSequencerStep(event.data.data.step);

                // Clear any existing timeout since we've received an external step
                if (externalStepTimeout) {
                    clearTimeout(externalStepTimeout);
                }

                // Set a new timeout to check if we receive another step in the next 2 seconds (or any other reasonable duration)
                externalStepTimeout = setTimeout(() => {
                    console.log(`[ms10] No external steps received for an extended period. Stopping arpeggiator.`);
                    stopArpeggiator();
                }, 250);  // Timeout duration can be adjusted based on your needs
            }
        });


// Function to capture settings when any control changes
function handleControlChange(event) {
    const element = event.target;
    const parentElement = element.closest('[data-synth-instance-id]');
    
    if (!parentElement) {
        console.error(`[eventListeners.js] Control element does not have a parent with 'data-synth-instance-id' attribute. Control ID: ${element.id}`);
        return;
    }

    const instanceId = parentElement.getAttribute('data-synth-instance-id');
    captureSettings(instanceId);
}

// List of control IDs that affect channelSettings
const controlIds = [
    'waveform',
    'note',
    'attack',
    'release',
    'cutoff',
    'resonance',
    'volume',
    'arpPattern',
    'arpSpeed',
    'arpTempo',
    'bpmAdjustValue',
    'timingAdjust',
    'useSequencerTiming'
];

// Add event listeners for each control
controlIds.forEach(controlId => {
    const controlElement = document.getElementById(controlId);
    if (controlElement) {
        controlElement.addEventListener('change', handleControlChange);
    }
});

      

document.getElementById("addRest").addEventListener("click", function() {
    arpNotes.push(null); // Using null to represent a rest
    updateArpNotesDisplay();
});

// Add an event listener to detect nudge slider activity
document.getElementById("timingAdjust").addEventListener('input', function() {
    isNudgeActive = true;
});

document.getElementById("timingAdjust").addEventListener('change', function() {
    isNudgeActive = false; // Reset when the user stops adjusting the slider
});


