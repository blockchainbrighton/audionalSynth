document.addEventListener('DOMContentLoaded', () => {
    const controlChannelButtons = document.querySelectorAll('.control-channel-btn');
    controlChannelButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const selectedControlChannel = e.target.getAttribute('data-control-channel-id');
            arpUI.currentChannel = selectedControlChannel;  // Update the currentChannel property

            console.log(`[controlChannels.js] Updated currentChannel to:`, arpUI.currentChannel);

            if (!selectedControlChannel) {
                console.error("[controlChannels.js] Missing selectedControlChannel");
                return;
            }

            // 1. Capture settings of the current channel before switching
            const currentActiveChannel = document.querySelector('.control-channel-btn.active');
            if (currentActiveChannel) {
                const currentChannelId = currentActiveChannel.getAttribute('data-control-channel-id');
                captureSettings(currentChannelId);
            }

            // 2. Switch to the new channel
            document.querySelectorAll('.control-channel-btn.active').forEach(activeButton => {
                activeButton.classList.remove('active');
            });
            e.target.classList.add('active');

            // 3. Apply settings of the new channel after switching
            applySettings(selectedControlChannel, selectedControlChannel);
        });
    });

    // Initialize the UI with default settings for the selected control channel
    const defaultChannelButton = document.querySelector('.control-channel-btn');
    if (defaultChannelButton) {
        const controlChannelId = defaultChannelButton.getAttribute('data-control-channel-id');
        const selectedChannel = defaultChannelButton.getAttribute('data-channel');
        applySettings(controlChannelId, selectedChannel);
    }
});
