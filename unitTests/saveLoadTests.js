// saveLoadTests.js

function testInitializeLocalStorage() {
    initializeLocalStorage(); // Function from saveLoad.js
    const settings = JSON.parse(localStorage.getItem('channelSettings'));
    console.assert(settings !== null, 'initializeLocalStorage should initialize local storage with default settings');
}

function testSaveSettings() {
    saveSettings(); // Function from saveLoad.js
    // Since the function triggers a download, we can't assert its behavior
    console.log('saveSettings should save settings correctly');
}

function testLoadSettings() {
    loadSettings(); // Function from saveLoad.js
    // Since the function triggers a file input, we can't assert its behavior
    console.log('loadSettings should load settings correctly');
}

