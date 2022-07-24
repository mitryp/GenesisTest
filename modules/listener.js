import { getBTCToUAHRate } from "./fetches.js";
import { notifySubscriptions } from "./subscription.js";

/**
 * The previous fetched BTC to UAH rate.
 * If the current rate differs from this value, the subscribers get notified.
 */
let previousRate = await getBTCToUAHRate();

/**
 * Registers the rate change check task with the given interval.
 * 
 * @param {number} interval the interval between the rate checks
 */
function registerRateChangeCheckTask(interval) {
    setInterval(async () => {
        const rate = await getBTCToUAHRate();
        console.log(`The current rate: ${rate}; The previous rate: ${previousRate}`);
        if (rate !== previousRate) {
            console.log('Notifying users')
            await notifySubscriptions(rate);
        } else {
            console.log('The rate didn\'t change')
        }
        previousRate = rate;

    }, interval);
}

export { registerRateChangeCheckTask };