// arpeggiatorTests.js

function testArpeggiatorPlay() {
    const arpeggiator = new Arpeggiator(); // Replace with actual instantiation
    arpeggiator.startArpeggiator();
    assert.strictEqual(arpeggiator.isArpeggiatorOn, true, 'Arpeggiator should start');
}

function testArpeggiatorStop() {
    const arpeggiator = new Arpeggiator(); // Replace with actual instantiation
    arpeggiator.stopArpeggiator();
    assert.strictEqual(arpeggiator.isArpeggiatorOn, false, 'Arpeggiator should stop');
}

function testArpeggiatorPatternChange() {
    const arpeggiator = new Arpeggiator(); // Replace with actual instantiation
    arpeggiator.applyArpeggiatorSettingsToChannel('newPattern'); // Replace with actual pattern
    assert.strictEqual(arpeggiator.currentPattern, 'newPattern', 'Arpeggiator pattern should change');
}
 
testArpeggiatorPlay();
testArpeggiatorStop();
testArpeggiatorPatternChange();
