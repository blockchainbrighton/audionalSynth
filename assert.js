// assert.js
function assert(condition, message) {
    if (!condition) {
        throw new Error(message || "Assertion failed");
    }
}

assert.strictEqual = function(actual, expected, message) {
    if (actual !== expected) {
        throw new Error(message || `Expected ${expected}, but got ${actual}`);
    }
};

// Make it globally accessible
window.assert = assert;
