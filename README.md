### An API for obtaining current Bitcoin to UAH exchange rate with a support of the email subscription for the rate change notifications.
Written as a part of the Entrance tests for a course.

Author: [*Dmytro Popov*](https://github.com/mitryp)

Language: *JavaScript/Node.js*

### API Endpoints
API base path: `/api/{endpoint}`

#### Endpoints
* `rate` -- accepts GET requests. Returns the current Bitcoin to UAH exchange rate in the response body.
* `subscribe` -- accepts POST requests with a formData that contains the `email` field. Allows to subscribe to the 
rate change notifications. If the given email is not subscribed yet, subscribes it to the subscription. Otherwise, 
returns 409 status code. The subscribers will be notified by email when the rate changes depending on the service settings.
* `sendEmails` -- accepts POST requests. The request causes the service to immediately notify the subscribers
with the current BTC to UAH rate.

### Settings
The settings can be done with the environment variables below.
Settings marked bold are necessary for the correct application work.

#### Mail Settings
* **MAIL_USER**:string - The email address of the mailbox to send the notification emails from.
* **MAIL_PASS**:string - The password of the mailbox to send the notification emails from. In most cases, you should generate 
a new password for an external mail client at your mail service.
* MAIL_SERVICE:string - The name of the mail service to send the notification emails from. By default, `gmail` service is used for Gmail.

#### Letters and Subscription Settings
* DB_PATH:string - The path to the JSON storage of subscription data.
  The default path is `./db.json`.
* RATE_CHECK_DELAY:number - The delay between the rate change checks *(in milliseconds)*. 
  If the rate changed, the subscribers will be notified of the current rate.
  The default delay is `20 minutes`.
* MAIL_RATE_PLACEHOLDER:string - The placeholder that will be replaced with the current BTC to UAH rate when notifying the subscribers.
Can be included both in the subject of the letter and/or in the letter content.
By default, the placeholder is `$RATE$`.
* MAIL_SUBJECT:string - The subject of the notification letters. By default, the subject is `BTC rate change notification`.
* MAIL_CONTENT:string - The content of the notification letters. By default, the content is `Current BTC to UAH rate is $RATE$UAH.`
