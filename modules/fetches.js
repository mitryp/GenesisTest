import fetch from "node-fetch";

/**
 * Fetches the given uri and returns a json parsed from the response.
 * @param {string} uri a uri to fetch - must return json response
 * @returns {Promise<unknown>} a json object parsed from the response
 */
async function fetchJson(uri) {
    const response = await fetch(uri);
    return await response.json();
}

/**
 * Returns the string representation of the floating point BTC to USD rate from the blockchain.info API.
 * @returns {Promise<string>} string float BTC to USD rate
 */
async function fetchBTCToUSDRate() {
    const btcRatesJson = await fetchJson('https://blockchain.info/ticker');
    const usdRecord = btcRatesJson['USD'];
    return usdRecord['buy'];
}

/**
 * Returns the string representation of the floating point USD to UAH rate from the NBU API.
 * @returns {Promise<number>} string float USD to UAH rate
 */
async function fetchUSDToUAHRate() {
    const uahRatesJson = await fetchJson('https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json');
    return uahRatesJson.filter((entry) => entry['cc'] === 'USD')[0]['rate'];
}

/**
 * Returns the BTC to UAH rate. When calculated, fetches the blockchain.info API to get the 
 * BTC to USD rate and NBU API to get the USD to UAH rate, and returns the multiplied rates.
 * @returns {Promise<number>} float BTC to UAH rate
 */
async function getBTCToUAHRate() {
    const btcToUsd = parseFloat(await fetchBTCToUSDRate());
    const usdToUah = await fetchUSDToUAHRate();
    return roundFloat(btcToUsd * usdToUah);
}

/**
 * Rounds the given number to the given digits after the point.
 * @param {number} num a number to round
 * @param {number} digits an amount of digits after point to round to
 * @returns rounded number
 */
function roundFloat(num, digits = 2) {
    const mul = Math.pow(10, digits);
    return Math.round(num * mul) / mul;
}

export { getBTCToUAHRate };