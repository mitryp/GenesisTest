const nodemailer = require('nodemailer');


// The following constants will be used to connect to the mail service

/**
 * Mail service username (probably, email).
 * Should be provided in order to connect to the mail service.
 */
const user = process.env.MAIL_USER;

/**
 * Mail service password.
 * Should be provided in order to connect to the mail service.
 */
const pass = process.env.MAIL_PASS;

/**
 * Mail service name.
 * Should be provided in order to connect to the mail service.
 * If not provided, the 'gmail' service will be used.
 */
const service = process.env.MAIL_SERVICE || 'gmail';


// The following constants are the letter settings
/**
 * The placeholder for the rate value. Will be replaced by it during the subscriber notification.
 * The default placeholder is '$RATE$'.
 */
const ratePlaceholder = process.env.MAIL_RATE_PLACEHOLDER || '$RATE$';

/**
 * The subject of the notification letters.
 * The rate placeholder (if present) will be replaced with the current exchange rate.
 */
const mailSubject = process.env.MAIL_SUBJECT || 'BTC rate change notification';

/**
 * The text of the notification letters. 
 * The rate placeholder (if present) will be replaced with the current exchange rate.
 */
const mailContent = process.env.MAIL_CONTENT || `Current BTC to UAH rate is ${ratePlaceholder}UAH.`;

console.log(pass);
console.log(service);


/**
 * Sends the notification email to the 'target' email.
 * Takes the 'rate', which is the current BTC to UAH exchange rate, and a 'transporter', which is 
 * a nodemailer.Transporter connected to the mail service.
 * 
 * The letter subject and content will be defined by the mailSubject and 
 * @param {string} target a target email that the email will be sent to
 * @param {number} rate the current BTC to UAH rate
 * @param {nodemailer.Mailer} transporter a mail transporter that will send the email
 */
function sendMail(target, rate, transporter) {
    const mailOptions = {
        from: user,
        to: target,
        subject: mailSubject.replace(ratePlaceholder, rate.toString()),
        text: mailContent.replace(ratePlaceholder, rate.toString())
    };

    transporter.sendMail(mailOptions,
        (error, _) => {
            if (error) {
                console.log(error);
            } else {
                console.log(`Sent email to ${target}`);
            }
        }
    );
}

/**
 * Returns a nodemailer.Transporter configured with the settings on the top of the document.
 * @returns {nodemailer.Mailer} a nodemailer.Transporter
 */
function getMailTransporter() {
    return nodemailer.createTransport({
        service: service,
        auth: {
            user: user,
            pass: pass
        }
    });
}


module.exports = { sendMail, getMailTransporter };