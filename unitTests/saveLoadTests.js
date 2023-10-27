// saveLoadTests.js

function testSaveSettings() {
    const settingsManager = new SettingsManager(); // Replace with actual instantiation
    settingsManager.saveSettings();
    assert.strictEqual(settingsManager.areSettingsSaved, true, 'Settings should be saved successfully');
}

function testLoadSettings() {
    const settingsManager = new SettingsManager(); // Replace with actual instantiation
    settingsManager.loadSettings();
    assert.strictEqual(settingsManager.areSettingsLoaded, true, 'Settings should be loaded successfully');
}

testSaveSettings();
testLoadSettings();
