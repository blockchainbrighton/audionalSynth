// controlChannels.js



document.addEventListener('DOMContentLoaded', function() {
    const channelButtons = document.querySelectorAll('.control-channel-btn');

    channelButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            channelButtons.forEach(b => b.classList.remove('active'));
            
            // Add active class to the clicked button
            this.classList.add('active');

            const selectedChannel = this.getAttribute('data-channel');

            // Update the selected channel menu and settings
            updateChannelMenu(selectedChannel);

            // Capture the current settings
            const controlChannelId = this.getAttribute('data-control-channel-id');
            captureSettings(controlChannelId);

            // Apply the settings for the selected channel
            applySettings(controlChannelId, selectedChannel);
        });
    });

    // Initialize the UI with default settings for the selected control channel
    const defaultChannelButton = document.querySelector('.control-channel-btn');
    const controlChannelId = defaultChannelButton.getAttribute('data-control-channel-id');
    const selectedChannel = defaultChannelButton.getAttribute('data-channel');
    applySettings(controlChannelId, selectedChannel);
});

function updateChannelMenu(channel) {
    // Logic to update the selected channel menu based on the selected channel
    // This will depend on how your current system is set up
    // For example:
    if (channel === 'all') {
        // Update settings for all channels
    } else {
        // Update settings for the specific channel
    }
}
