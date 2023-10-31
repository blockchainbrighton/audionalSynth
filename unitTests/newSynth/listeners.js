document.addEventListener('DOMContentLoaded', function() {
    const channelButtonsContainer = document.getElementById('channelButtonsContainer');
    const numberOfChannels = 16; // Adjust as needed

    // Create channel buttons
    for (let i = 1; i <= numberOfChannels; i++) {
        const channelButton = document.createElement('button');
        channelButton.classList.add('control-channel-btn');
        channelButton.textContent = `Ch ${i}`;
        channelButton.dataset.channel = i;

        // Set channel 1 as active by default
        if (i === 1) {
            channelButton.classList.add('active');
        }

        channelButtonsContainer.appendChild(channelButton);
    }

    // Event listener for channel buttons
    channelButtonsContainer.addEventListener('click', function(event) {
        if (event.target.classList.contains('control-channel-btn')) {
            // Remove active class from all buttons
            document.querySelectorAll('.control-channel-btn').forEach(btn => btn.classList.remove('active'));

            // Add active class to clicked button
            event.target.classList.add('active');
        }
    });


    // Add event listeners
    document.getElementById('saveSettingsBtn').addEventListener('click', saveSettings);
    document.getElementById('loadSettingsBtn').addEventListener('click', loadSettings);

    // Other JavaScript code...
});
