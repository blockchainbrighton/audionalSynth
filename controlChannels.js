// controlChannels.js



document.addEventListener('DOMContentLoaded', (event) => {
    const controlChannelButtons = document.querySelectorAll('.control-channel-btn');
    controlChannelButtons.forEach(button => {
        button.addEventListener('click', function() {
            const controlChannelId = this.getAttribute('data-control-channel-id');
            const selectedChannel = this.getAttribute('data-channel');
            captureSettings(controlChannelId);
            applySettings(controlChannelId, selectedChannel);
        });
    });

    document.querySelectorAll(".control-channel-btn").forEach(button => {
        button.addEventListener('click', function(e) {
            // Remove active class from all buttons
            document.querySelectorAll('.control-channel-btn.active').forEach(activeButton => {
                activeButton.classList.remove('active');
            });
            
            // Add active class to the clicked button
            e.target.classList.add('active');
        });
    });



    // Initialize the UI with default settings for the selected control channel
    const defaultChannelButton = document.querySelector('.control-channel-btn');
    const controlChannelId = defaultChannelButton.getAttribute('data-control-channel-id');
    const selectedChannel = defaultChannelButton.getAttribute('data-channel');
    applySettings(controlChannelId, selectedChannel);
});

