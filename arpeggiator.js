// arpeggiator.js
        let isArpeggiatorOn = false;
        let currentArpNotes = [];
        let arpNotesByChannel = {
            'all': [],
            '1': [],
            '2': [],
            '3': [],
            '4': [],
            '5': [],
            '6': [],
            '7': [],
            '8': [],
            '9': [],
            '10': [],
            '11': [],
            '12': [],
            '13': [],
            '14': [],
            '15': [],
            '16': []
        };
                
        let currentArpIndex = 0;
        let arpTimeout = null;
        let nudgeApplied = false;
        let isNudgeActive = false;

       

      // arpControl.js
        function startArpeggiator(){
            isArpeggiatorOn = true;
            playArpNotes();
        }
        function playArpeggiator(){
            startArpeggiator();
        }
        function stopArpeggiator(){
            isArpeggiatorOn = false;
            currentArpNotes.length = 0;
        }

  

        function applySpeedModifier(baseInterval) {
            let speed = document.getElementById("arpSpeed").value;

            switch(speed) {
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
                    console.error("Unknown speed setting:", speed);
                    return baseInterval;
            }
        }


        function incrementArpIndex() {
            currentArpIndex = (currentArpIndex + 1) % currentArpNotes.length;  // Wrap around
        }

        function decrementArpIndex() {
            currentArpIndex = (currentArpIndex - 1 + currentArpNotes.length) % currentArpNotes.length;  // Wrap around, but in reverse
        }

        function randomizeArpIndex() {
            currentArpIndex = Math.floor(Math.random() * currentArpNotes.length);  // Random index
        }

        // Additional Pattern Functions
        let goingUp = true;

        function upDownArpIndex() {
            if (goingUp) {
                incrementArpIndex();
                if (currentArpIndex === currentArpNotes.length - 1) {
                    goingUp = false;
                }
            } else {
                decrementArpIndex();
                if (currentArpIndex === 0) {
                    goingUp = true;
                }
            }
        }

        function doubleStepArpIndex() {
            currentArpIndex = (currentArpIndex + 2) % currentArpNotes.length;
        }

        function randomWithRestsArpIndex() {
            if (Math.random() > 0.8) { // 20% chance of rest
                return;
            }
            randomizeArpIndex();
        }


        function pauseArpeggiator() {
            clearTimeout(arpTimeout);  // Clear the timeout to stop the arpeggiator
            isArpeggiatorOn = false;
        }

        function resetTimingAdjust() {
            document.getElementById("timingAdjust").value = 0;
        }


        function updateArpNotesDisplay() {
            const canvas = document.getElementById("arpNotesDisplay");
            const ctx = canvas.getContext("2d");
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Set font size and weight
            ctx.font = "bold 11px Arial";
            ctx.fillStyle = "#FFFFFF";
            
            const columns = 16;
            const noteWidth = ctx.measureText("W#").width; 
            const spacing = noteWidth + 7; 
            let x = 10;
            let y = 30;
            
            let currentColumn = 0;
        
            const currentChannel = getControlChannelValue();
            currentArpNotes = arpNotesByChannel[currentChannel]; // Get the arpNotes array for the current channel
            
            console.log("[ArpNotes Display Update] Starting update for arpNotes:", currentArpNotes);
            
            currentArpNotes.forEach(note => {
                let noteText = note !== null ? frequencyToNoteName(note) : "Rest";
            
                // Check if the next note (including its spacing) would overflow the canvas width
                if (x + spacing > canvas.width) {
                    currentColumn = 0;
                    x = 10;
                    y += 30;
                }
            
                ctx.fillText(noteText, x, y);
                        
                currentColumn++;
                if (currentColumn >= columns) {
                    currentColumn = 0;
                    x = 10;
                    y += 30;
                } else {
                    x += spacing;
                }
            });
            
            console.log("[ArpNotes Display Update] Finished update for arpNotes.");
        }
        
        
        
        // arpToggle.js
        function toggleArpeggiator(){
            const btn = document.getElementById("arpToggle");
            if(isArpeggiatorOn){
                btn.innerText = "Start Arpeggiator";
                stopArpeggiator();
            } else {
                btn.innerText = "Stop Arpeggiator";
                startArpeggiator();
            }
        }
       