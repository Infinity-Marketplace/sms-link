import {
  formatMessage,
  getSettings,
  isMessageValid,
  logEvent,
} from '../utils/helpers'

export async function paymentApproved(
  ctx: StatusChangeContext,
  next: () => Promise<any>
) {
  const {
    clients: { oms, sms },
  } = ctx

  if (ctx.body.domain === 'Marketplace') {
    const settings = await getSettings(ctx)

    if (
      settings.allowPaymentAuthorizedSMS &&
      settings.onlinePaymentAuthorizedText &&
      isMessageValid(settings.onlinePaymentAuthorizedText)
    ) {
      const order = await oms.order(ctx.body.orderId)

      if (order != null) {
        const message = formatMessage(
          settings.onlinePaymentAuthorizedText,
          order,
          'order',
          settings.addOneDayToDeliveryDate
        )

        // Send message to user
        await sms.sendJsonMessage({
          connection_id: settings.connectionID,
          password: settings.password,
          to: order.clientProfileData.phone,
          message,
          test: settings.enableSandbox ? 1 : 0,
        })
      } else {
        logEvent('Critical', 'Error', 'get-order-info', {
          account: ctx.vtex.account,
          message: `Invalid Order data received for orderId=${ctx.body.orderId} !`,
          sourceType: 'LOG',
        })
      }
    } else if (settings.allowPaymentAuthorizedSMS) {
      logEvent('Critical', 'Error', 'get-settings', {
        account: ctx.vtex.account,
        message: 'Empty <message> or invalid character detected!',
        sourceType: 'LOG',
      })
    }
  }

  await next()
}
