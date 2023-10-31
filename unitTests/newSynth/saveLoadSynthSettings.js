// saveLoadSynthSettings.js

function saveSettings() {
    // Convert data to JSON string
    const jsonData = JSON.stringify(synthSettings, null, 2);

    // Trigger download of JSON file
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'synth_settings.json';
    a.click();
    URL.revokeObjectURL(url);
}



function loadSettings() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';

    input.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const loadedData = JSON.parse(e.target.result);
        
                    // Apply loaded settings to the synth
                    applySynthSettings(loadedData);
        
                    // Update the master settings object
                    Object.assign(synthSettings, loadedData);
                } catch (error) {
                    console.error('Error loading settings:', error);
                }
            };
            reader.readAsText(file);
        }
    });

    input.click();
}
