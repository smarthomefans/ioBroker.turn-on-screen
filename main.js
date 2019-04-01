"use strict";

/*
 * Created with @iobroker/create-adapter v1.11.0
 */

// The adapter-core module gives you access to the core ioBroker functions
// you need to create an adapter
const utils = require("@iobroker/adapter-core");
const robot = require("robotjs");

// Load your modules here, e.g.:
// const fs = require("fs");

class TurnOnScreen extends utils.Adapter {

    /**
     * @param {Partial<ioBroker.AdapterOptions>} [options={}]
     */
    constructor(options) {
        super({
            ...options,
            name: "turn-on-screen",
        });
        this.on("ready", this.onReady.bind(this));
        this.on("stateChange", this.onStateChange.bind(this));
        this.on("unload", this.onUnload.bind(this));
    }

    /**
     * Is called when databases are connected and adapter received configuration.
     */
    async onReady() {
        // Initialize your adapter here

        // The adapters config (in the instance object everything under the attribute "native") is accessible via
        // this.config:
        this.log.info("config byKeyboard: " + this.config.byKeyboard);
        this.log.info("config byMouse: " + this.config.byMouse);

        await this.setObjectAsync("TurnOn", {
            type: "state",
            common: {
                name: "testVariable",
                type: "boolean",
                role: "button",
                read: true,
                write: true,
            },
            native: {},
        });

        // in this template all states changes inside the adapters namespace are subscribed
        this.subscribeStates("*");
    }

    /**
     * Is called when adapter shuts down - callback has to be called under any circumstances!
     * @param {() => void} callback
     */
    onUnload(callback) {
        try {
            this.log.info("cleaned everything up...");
            callback();
        } catch (e) {
            callback();
        }
    }

    /**
     * Is called if a subscribed state changes
     * @param {string} id
     * @param {ioBroker.State | null | undefined} state
     */
    onStateChange(id, state) {
        if (state) {
            // The state was changed
            this.log.silly(`state ${id} changed: ${state.val} (ack = ${state.ack})`);
            robot.moveMouse(0, 0);
        } else {
            // The state was deleted
            this.log.info(`state ${id} deleted`);
        }
    }
}

// @ts-ignore
if (module.parent) {
    // Export the constructor in compact mode
    /**
     * @param {Partial<ioBroker.AdapterOptions>} [options={}]
     */
    module.exports = (options) => new TurnOnScreen(options);
} else {
    // otherwise start the instance directly
    new TurnOnScreen();
}