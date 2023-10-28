// ChannelSettingsManager.js

class ChannelSettingsManager {
    constructor() {
        this.defaultSettings = {
            waveform: 'sawtooth',
            note: 'defaultNote',
            attack: '10',
            release: '500',
            cutoff: '2000',
            resonance: '5',
            volume: '100',
            arpPattern: 'up',
            arpSpeed: 'normal',
            arpTempo: '105',
            bpmAdjustValue: '0.5',
            timingAdjust: '0',
            useSequencerTiming: false    
        };

        this.settings = {};
        this.initializeDefaultSettings();
    }

    initializeDefaultSettings() {
        for (let i = 1; i <= 16; i++) {
            this.settings[i] = { ...this.defaultSettings };
        }
        console.log("[ChannelSettingsManager] Initialized default channel settings:", this.settings);
    }

    captureSettings(selectedControlChannel, container) {
        console.log("[ChannelSettingsManager] captureSettings called for channel:", selectedControlChannel);

        const settingsKeys = Object.keys(this.defaultSettings);
        const settings = {};

        settingsKeys.forEach(key => {
            const element = container.querySelector(`#${key}`);
            if (element) {
                settings[key] = element.type === 'checkbox' ? element.checked : element.value;
            }
        });

        console.log(`[ChannelSettingsManager] Captured settings for controlChannelId ${selectedControlChannel}:`, settings);

        this.settings[selectedControlChannel] = { ...this.settings[selectedControlChannel], ...settings };

        // Additional logic can be added here as required

        localStorage.setItem('channelSettings', JSON.stringify(this.settings));
    }

    getSettings(controlChannel) {
        const settings = this.settings[controlChannel] || { ...this.defaultSettings };
        console.log(`[ChannelSettingsManager] Retrieved settings for Control Channel ${controlChannel}:`, settings);
        return settings;
    }

    applySettings(controlChannelId, selectedChannel, container, updateArpNotesDisplay) {
        console.log("[ChannelSettingsManager] applySettings called for channel:", controlChannelId);

        const savedSettings = JSON.parse(localStorage.getItem('channelSettings'));
        if (savedSettings) {
            Object.assign(this.settings, savedSettings);
        }

        const settings = this.getSettings(controlChannelId);
        console.log(`[ChannelSettingsManager] Applying settings for controlChannelId ${controlChannelId}, Control Channel ${selectedChannel}:`, settings);

        for (const [key, value] of Object.entries(settings)) {
            const element = container.querySelector(`#${key}`);
            if (element) {
                element.type === 'checkbox' ? element.checked = value : element.value = value;
            }
        }

        // Update the arp notes display after applying the settings
        console.log("[ChannelSettingsManager] Before calling updateArpNotesDisplay");

        if (typeof updateArpNotesDisplay === 'function' && arpUI) {
            updateArpNotesDisplay();
        }
    
        console.log(`[ChannelSettingsManager] Applied settings for controlChannelId ${controlChannelId}, Control Channel ${selectedChannel}:`, settings);
    }
}
