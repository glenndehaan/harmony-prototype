const express = require('express');
const {getHarmonyClient} = require('@harmonyhub/client-ws');
const app = express();

/**
 * Trust proxy
 */
app.enable('trust proxy');

/**
 * Request logger
 */
app.use((req, res, next) => {
    console.log(`[WEB][REQUEST]: ${req.originalUrl}`);
    next();
});

/**
 * Configure routes
 */
app.get('/', (req, res) => {
    res.send('Nothing here...');
});
app.get('/api/mute', async (req, res) => {
    await muteTv();
    res.send('Command send!');
});

/**
 * Disable powered by header for security reasons
 */
app.disable('x-powered-by');

/**
 * Start listening on port
 */
app.listen(9097, "0.0.0.0", () => {
    console.log(`[WEB] App is running on: 0.0.0.0:9097`);
    console.log(`[HARMONY] IP set: ${process.env.IP}`);
});

async function run() {
    const harmonyClient = await getHarmonyClient(process.env.IP);
    const commands = await harmonyClient.getAvailableCommands();
    const device = commands.device[1].controlGroup[2].function[0];

    console.log('commands', JSON.stringify(commands));
    console.log('device', JSON.stringify(device));

    const tv = commands.device.find((dev) => dev.type === 'Television');
    console.log('Functions for television', tv.controlGroup.map((control) => `${control.name} [${control.function.map((func) => func.name)}]`));

    await harmonyClient.send('holdAction', device.action, 100);
}

async function muteTv() {
    const harmonyClient = await getHarmonyClient(process.env.IP);
    const commands = await harmonyClient.getAvailableCommands();
    const device = commands.device[1].controlGroup[2].function[0];

    await harmonyClient.send('holdAction', device.action, 100);
    await harmonyClient.end();
}
