document.addEventListener("DOMContentLoaded", function() {
    const container = document.getElementById('channel-buttons-container');

    for (let i = 1; i <= 16; i++) {
        // Channel button
        const channelBtn = document.createElement('button');
        channelBtn.className = 'control-channel-btn';
        channelBtn.setAttribute('data-channel', i);
        channelBtn.setAttribute('data-control-channel-id', i);
        channelBtn.innerText = i;
        container.appendChild(channelBtn);

        // Solo button
        const soloBtn = document.createElement('button');
        soloBtn.className = 'control-channel-btn solo-btn';
        soloBtn.setAttribute('data-channel', i);
        soloBtn.setAttribute('data-control-channel-id', `solo-${i}`);
        soloBtn.innerText = `Solo ${i}`;
        container.appendChild(soloBtn);

        // Solo button functionality
        soloBtn.addEventListener('click', function() {
            // Logic to solo the channel
            // For example, if using an audio API, you can mute all other channels except for the one corresponding to this solo button
        });
    }
});
