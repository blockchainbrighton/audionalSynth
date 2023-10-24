// soloButtons.js

document.addEventListener("DOMContentLoaded", function() {
    const container = document.getElementById('channel-buttons-container');
    const modal = document.getElementById('soloChannelModal');
    const closeModal = document.querySelector('.close');
    const soloChannelNumber = document.getElementById('soloChannelNumber');
    const soloSynthContainer = document.getElementById('soloSynthContainer');
    const mainSynthContainer = document.getElementById('mainSynthContainer');

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

        console.log(`[soloButtons.js] Created channel button with control-channel-id:`, i);
        console.log(`[soloButtons.js] Created solo button with control-channel-id: solo-${i}`);
    

        // Solo button functionality
        soloBtn.addEventListener('click', function() {
            // Logic to solo the channel
            // For example, if using an audio API, you can mute all other channels except for the one corresponding to this solo button
        

            // Open the modal
                soloChannelNumber.textContent = i; // Display the soloed channel number
                soloSynthContainer.innerHTML = mainSynthContainer.innerHTML; // Replicate the controls
                modal.style.display = "block";
            });
        }

        // When the user clicks on <span> (x), close the modal
        closeModal.onclick = function() {
            modal.style.display = "none";
        }

        // When the user clicks anywhere outside of the modal, close it
        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }
    });