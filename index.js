import { getBTCToUAHRate } from './modules/fetches.js';
import { subscribe, notifySubscriptions } from './modules/subscription.js';
import { registerRateChangeCheckTask } from './modules/listener.js';
import express from 'express';

const app = express();

const pathBase = '/api';

/**
 * A port that the app will run on.
 * Default value is 8080.
 * If you want to change the port, don't forget to change the port in the Docker configuration.
 */
const PORT = 8080;

/**
 * An interval between the rate change checks.
 * Default value is 20 minutes, another can be set with RATE_CHECK_DELAY environment variable.
 */
const RATE_CHECK_DELAY = process.env.RATE_CHECK_DELAY || (1000 * 60 * 20); // 20 minutes delay

// Register a repeated task to notify the subscribers in case of rate changes
registerRateChangeCheckTask(RATE_CHECK_DELAY);

// Register a middleware to parse the formData of requests
app.use(express.urlencoded({ extended: true }));

// Start the listening on the defined port
app.listen(
    PORT,
    () => console.log(`Alive on http://localhost:${PORT}`)
)

// GET /rate operation handler -- returns the BTC to UAH rate in the response body
app.get(`${pathBase}/rate`, async (request, response) => {
    console.log(`${request.ip} GET /rate`);
    try {
        const rate = await getBTCToUAHRate();
        response.status(200).send(`${rate}`);
    } catch (e) {
        response.status(400).send('Invalid status code');
    }
})

// POST /sendEmails operation handler -- makes the API send the current BTC to UAH rate 
// to the subscribed emails
app.post(`${pathBase}/sendEmails`, async (request, response) => {
    console.log(`${request.ip} POST /sendEmails`);
    notifySubscriptions(await getBTCToUAHRate());
    response.status(200).send({ 'description': 'E-mailʼи відправлено' });
});

// POST{email} /subscribe operation handler -- subscribes an email provided in the 'email' field
// of the formData to the BTC rate change notifications
app.post(`${pathBase}/subscribe`, async (request, response) => {
    console.log(`${request.ip} POST /subscribe`);
    const email = request.body.email;
    if (!email) {
        response.status(400).send({ 'error': 'Не надано email для підписки' });
        return;
    }
    const res = await subscribe(email);
    if (res) {
        response.status(200).send({ 'description': 'Email додано' });
    } else {
        response.status(409).send({ 'error': 'Email уже є в базі даних' });
    }
})
