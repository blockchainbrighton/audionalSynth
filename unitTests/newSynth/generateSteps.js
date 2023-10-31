//generateSteps.js

                // Function to generate steps based on arpLength
                function generateSteps() {
                    const arpLength = document.getElementById('arpLength').value;
                    const stepContainer = document.getElementById('recordedNotesDisplay');
                    stepContainer.innerHTML = ''; // Clear existing steps
            
                    // Determine the number of rows and columns based on arpLength
                    let rows = 1;
                    let columns = 16;
                    if (arpLength > 16) {
                        columns = 32; // Use 32 columns for all arpLengths greater than 16
                    }
                    if (arpLength > 32 && arpLength <= 64) {
                        rows = 2; // Two rows for 64 steps
                    } else if (arpLength > 64) {
                        rows = 4; // Four rows for 128 steps
                    }
            
                    // Set grid template rows and columns based on the number of rows and columns
                    stepContainer.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
                    stepContainer.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
            
                    // Generate steps
                    for (let i = 1; i <= arpLength; i++) {
                        const stepDiv = document.createElement('div');
                        stepDiv.className = 'step';
                        stepDiv.dataset.step = i;
                        stepContainer.appendChild(stepDiv);
                    }
                }
            
                // Initial generation of steps
                generateSteps();
            
                // Update steps when arpLength changes
                document.getElementById('arpLength').addEventListener('change', generateSteps);
