import {readFile, writeFile} from "fs/promises";
import pkg from './mails.cjs';

const { sendMail, getMailTransporter } = pkg;

/**
 * A path to the json storage file.
 */
const dbPath = process.env.DB_PATH || './db.json';

/**
 * Subscribes the given email to the rate changes.
 * Returns boolean depending on the result.
 * @param {string} email a new email to subscribe
 * @returns {Promise<boolean>} true if the email was unique and subscribed successfully;
 *                    false if the email was already subscribed
 */
async function subscribe(email) {
    const nEmail = normalize(email);
    const subscriptions = await getSubscriptions();

    // check if the email is already subscribed
    if (subscriptionExists(nEmail, subscriptions)) {
        return false;
    }

    // add the normalized email to the list and save it
    subscriptions.push(nEmail);
    saveSubscriptions(subscriptions);
    return true;
}

/**
 * Returns true if the give email is already subscribed to the rate changes. 
 * Otherwise, returns false.
 * 
 * subscriptionList is a list of existing subscriptions.
 * @param {string} email a trimmed and lowercased email
 * @param {Array<string>} subscriptionList an array of the existing subscriptions
 * @returns true if the email is contained in the subscriptionList; false otherwise
 */
function subscriptionExists(email, subscriptionList) {
    for (let i = 0; i < subscriptionList.length; i++) {
        if (subscriptionList[i] === email) {
            return true;
        }
    }
    return false;
}

/**
 * Returns an array of the saved subscriptions read from the json storage.
 * If the file of the storage doesn't exist, returns an empty array.
 * @returns {Promise<Array<string>>} an array of the registered subscriptions
 */
async function getSubscriptions() {
    try {
        // if the file exists, return the content
        const f = await readFile(dbPath);
        return JSON.parse(f);
    } catch (e) {
        // otherwise, return an empty array
        return [];
    }
}

/**
 * Asynchronously saves the given array of emails to the JSON file storage.
 * @param {Array<string>} subscriptionList an array of emais subscribed to the rate changes
 */
function saveSubscriptions(subscriptionList) {
    const newSubscriptionData = JSON.stringify(subscriptionList);
    writeFile(dbPath, newSubscriptionData).then(() => console.log('The subscriptions updated'));
}

/**
 * Normalizes the email format: trims and lowercases it.
 * @param {string} email an email
 * @returns the trimmed and lowercased email
 */
function normalize(email) {
    return email.trim().toLowerCase();
}

/**
 * Sends the email with the current rate to each of the subscribed emails.
 * 
 * The format of the emails can be set in the 'mails.cjs' file.
 * @param {number} rate the BTC to UAH exchange rate
 */
async function notifySubscriptions(rate) {
    const transporter = getMailTransporter();
    const subscriptions = await getSubscriptions();
    for (let i = 0; i < subscriptions.length; i++) {
        const target = subscriptions[i];
        sendMail(target, rate, transporter);
    }
}

export { subscribe, getSubscriptions, notifySubscriptions };