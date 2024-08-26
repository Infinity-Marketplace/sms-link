# VTEX SMSLink

Allows the sending of transactional SMS messages to customers using SMSLink SMS Gateway. This application uses [Feed v3 Hook](https://developers.vtex.com/reference/feed-v3) for receiving status updates from OMS.

This app handles events sent by the app `vtex.orders-broadcast` and `vtex.return-app`[^1] to notify customers using the SMSLink SMS Gateway API.

## Installation Guide

Open the VTEX App Store and install this app on your store, or run the following command on VTEX toolbelt:
`vtex install infinityro.smslink@0.x`

## Setup

Go to `https://{accountName}.myvtex.com/admin/apps/`, search for `SMSLink` and fill up the form with the settings you need.

1. `Enable Test Mode` - This option can be used if you are further developing this app. When checked the transactional messages sent through the SMSLink Gateway API will just be simulated and no charges will be incurred on your SMSLink account.

2. `Connection ID` & `Password` - Those fields are mandatory and their values are generated through your SMSLink account in the SMS Gateway (JSON) configuration section.

3. `Send Order received SMS` & `Order received SMS message` - If the `Send Order received SMS` option is checked then the customer will receive a transactional SMS message through the SMSLink SMS Gateway every time the `order-created` event is received. The content of the transactional message is specified inside the `Order received SMS message` input field. The `{order_id}` will automatically be replaced with the customer's `orderId` upon sending.

4. `Send Order cancelled SMS` & `Order cancelled SMS message` - If the `Send Order cancelled SMS` option is checked then the customer will receive a transactional SMS message through the SMSLink SMS Gateway every time the `cancel` event is received. The content of the transactional message is specified inside the `Order cancelled SMS message` input field. The `{order_id}` will automatically be replaced with the customer's `orderId` upon sending.

5. `Send Online payment authorized SMS` & `Online payment Authorized SMS message` - If the `Send Online payment authorized SMS` option is checked then the customer will receive a transactional SMS message through the SMSLink SMS Gateway every time the `payment-approved` event is received. The content of the transactional message is specified inside the `Online payment Authorized SMS message` input field. The `{order_id}` will automatically be replaced with the customer's `orderId` upon sending.

6. `Send Online payment error SMS` & `Online payment error SMS message` - If the `Send Online payment error SMS` option is checked then the customer will receive a transactional SMS message through the SMSLink SMS Gateway every time the `payment-denied` event is received. The content of the transactional message is specified inside the `Online payment error SMS message` input field. The `{order_id}`, `{first_name}`, `{last_name}`, `{email}`, `{order_total}` will automatically be replaced with the customer's order corresponding values upon sending.

7. `Send Return request SMS` & `Return request received SMS message` - If the `Send Return request SMS` option is checked then the customer will receive a transactional SMS message through the `vtex.return-app` ervery time a return request has been recived. The content of the transactional message is specified inside the `Return request received SMS message` input field. The `{request_id}`, `{name}`, `{email}`, `{order_id}`, `{gift_card_code}`, `{gift_card_id}`, `{refunded_amount}` will automatically be replaced with the customer's return request corresponding values upon sending.

8. `Send Returned parcel received by store SMS` & `Send Returned parcel received by store SMS message` - If the `Send Returned parcel received by store SMS` option is checked then the customer will receive a transactional SMS message through the `vtex.return-app` ervery time the status of the return request is changed to `picked`. The content of the transactional message is specified inside the `Send Returned parcel received by store SMS message` input field. The `{request_id}`, `{name}`, `{email}`, `{order_id}`, `{gift_card_code}`, `{gift_card_id}`, `{refunded_amount}` will automatically be replaced with the customer's return request corresponding values upon sending.

9. `Return request finalized SMS` & `Return request finalized SMS message` - If the `Return request finalized SMS` option is checked then the customer will receive a transactional SMS message through the `vtex.return-app` ervery time the the return request is approved. The content of the transactional message is specified inside the `Return request finalized SMS message` input field. The `{request_id}`, `{name}`, `{email}`, `{order_id}`, `{gift_card_code}`, `{gift_card_id}`, `{refunded_amount}` will automatically be replaced with the customer's return request corresponding values upon sending.

10. `Return request denied SMS` & `Return request denied SMS message` - If the `Return request denied SMS` option is checked then the customer will receive a transactional SMS message through the `vtex.return-app` ervery time the the return request is denied. The content of the transactional message is specified inside the `Return request denied SMS message` input field. The `{request_id}`, `{name}`, `{email}`, `{order_id}`, `{gift_card_code}`, `{gift_card_id}`, `{refunded_amount}` will automatically be replaced with the customer's return request corresponding values upon sending.

# How it works?

1. For [Feed V3 Hooks](https://developers.vtex.com/reference/feed-v3)

When one of the `order-created`, `cancel`, `payment-approved` or `payment-denied` events is received, the app will check if the corresponding option fields are checked (if it is allowed to send the transactional message or not). If the app is allowed to send the transactional message then it will retrieve the order data and send the message to the customer phone number through the SMSLink SMS Gateway.

2. For `vtex.return-app`[^1]

When the return request state changes to one of the following states: `New`, `Picked up from client`, `Approved` or `Denied` the `vtex.return-app` will send a request to the SMSLink app through `https://{accountName}.myvtex.com/sms-link-app/send-sms` route. The SMSLink app will then check if it is allowed to send the transactional message according to the specified event and send the message to the custumer phone number through the SMSLink SMS Gateway.


[^1]: The `vtex.smslink` & `vtex.return-app` will be available in future `vtex.return-app` update 