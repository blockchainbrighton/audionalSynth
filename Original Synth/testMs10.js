

// testMs10.js

function testChannelManagement() {
    console.log("Testing channel management...");

    // Simulate channel switching and settings capture
    for (let i = 1; i <= 16; i++) {
        captureSettings(i.toString());
        applySettings(i.toString(), i.toString());
    }

    // Verify settings for each channel
    for (let i = 1; i <= 16; i++) {
        const settings = getSettings(i.toString());
        if (!settings || Object.keys(settings).length === 0) {
            console.error(`Channel management test failed for channel ${i}`);
            return;
        }
    }

    console.log("Channel management test completed successfully.");
}
