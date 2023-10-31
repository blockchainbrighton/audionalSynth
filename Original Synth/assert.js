// assert.js
function assert(condition, message) {
    if (!condition) {
        throw new Error(message || "Assertion failed");
    }
}

// Make it globally accessible
window.assert = assert;