// initialiseAndUpdateNoteArrays.js

function initializeNoteArray(length) {
    // Initialize an array with 'length' elements, all set to null
    return new Array(length).fill(null);
}

function updateNoteArrayAndUI(channel, index, note) {
    // Validate the index
    if (index < 0 || index >= synthSettings.arpNoteArrays[channel].length) {
        console.error("Index out of bounds for note array");
        return;
    }

    // Update the note array for the specified channel
    synthSettings.arpNoteArrays[channel][index] = note;

    // Find the corresponding step element in the UI
    const stepElement = document.querySelector(`.step[data-step="${index + 1}"]`);

    // Update the UI based on the presence of the note
    if (stepElement) {
        stepElement.classList.toggle('has-note', !!note);
        stepElement.textContent = note || '';
    }
}

// Example usage:
let arpLength = 16; // This can be set based on user input
let currentChannel = synthSettings.currentChannel; // Get the current channel
synthSettings.arpNoteArrays[currentChannel] = initializeNoteArray(arpLength); // Initialize the note array for the current channel

// Updating the note array and UI for the current channel
updateNoteArrayAndUI(currentChannel, 0, "C4"); // Sets the first step to note C4 and updates UI
updateNoteArrayAndUI(currentChannel, 1, null); // Sets the second step to null (rest) and updates UI
