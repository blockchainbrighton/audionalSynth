// audionalSynthOptimizationTests.js

/**
 * Audional Synth Optimization Tests
 * 
 * Instructions:
 * 1. Integrate this file into your Audional Synth project.
 * 2. Ensure that any required functions or variables from the main application are accessible.
 * 3. Open the application in a browser.
 * 4. Open the browser's developer console.
 * 5. Execute the desired test function, e.g., testAudioContextCreation().
 * 6. Observe the results printed in the console.
 */

// Test 1: Evaluate the creation and destruction of AudioContext instances
function testAudioContextCreation() {
    const startTime = performance.now();
    for (let i = 0; i < 100; i++) {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        audioContext.close();
    }
    const endTime = performance.now();
    console.log('Time taken for 100 AudioContext creations and destructions:', endTime - startTime, 'ms');
}

// Test 2: Evaluate the latency when initiating multiple channels simultaneously
function testMultipleChannelLatency() {
    const startTime = performance.now();
    for (let i = 1; i <= 10; i++) {
        playMS10TriangleBass(440, i); // Play A4 note on channels 1 to 10
    }
    const endTime = performance.now();
    console.log(`Time taken to play on 10 channels: ${endTime - startTime} ms`);
}

// Test 3: Evaluate memory consumption over time
function testMemoryConsumption() {
    const initialMemory = performance.memory.usedJSHeapSize;
    for (let i = 1; i <= 10; i++) {
        playMS10TriangleBass(440, i); // Play A4 note on channels 1 to 10
    }
    const finalMemory = performance.memory.usedJSHeapSize;
    console.log(`Memory consumed for playing on 10 channels: ${finalMemory - initialMemory} bytes`);
}


// Test 4: Evaluate the latency when changing the frequency of a playing note
function testFrequencyChangeLatency() {
    const startTime = performance.now();
    playMS10TriangleBass(440, 1); // Start playing A4 note on channel 1
    playMS10TriangleBass(466.16, 1); // Change to A#4 note on channel 1
    const endTime = performance.now();
    console.log(`Time taken to change frequency on a playing channel: ${endTime - startTime} ms`);
}

// Test 5: Determine the maximum number of concurrent channels before performance degradation
function testMaxConcurrentChannels() {
    let maxChannels = 0;
    const startTime = performance.now();
    while (true) {
        maxChannels++;
        playMS10TriangleBass(440 + maxChannels, maxChannels); // Play different frequencies on different channels
        const currentTime = performance.now();
        if (currentTime - startTime > 1000) { // If more than 1 second has passed, stop the test
            maxChannels--; // Reduce the count by 1, as the last channel caused the delay
            break;
        }
    }
    console.log(`Maximum number of concurrent channels without degradation: ${maxChannels}`);
}

// Function to run all tests in sequence
function runAllTests() {
    console.log("Starting all tests...");
    testAudioContextCreation();
    testMultipleChannelLatency();
    testMemoryConsumption();
    testFrequencyChangeLatency();
    testMaxConcurrentChannels();
    console.log("All tests completed.");
}

function testMultiChannelSoundQuality() {
    console.log("Testing multi-channel sound quality...");
    
    // Test playing sound on multiple channels
    for (let i = 1; i <= 16; i++) {
        playMS10TriangleBass(440 + i * 10, i);
    }

    console.log("Multi-channel sound quality test completed.");
}




// Note: These tests are basic and may need to be adjusted based on the actual implementation details of the Audional Synth application.
