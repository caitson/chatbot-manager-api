// swagger/paths/message.js
const { postWithBody } = require('../helpers')

const bodyMessage = {
  messageId: {
    type: 'string',
    description: 'ID da mensagem',
    example: '3EB0ABC123DEF456'
  },
  chatId: {
    type: 'string',
    description: 'ID do chat onde a mensagem está',
    example: '263260037222655@c.us'
  }
}

module.exports = {
  ...postWithBody('/message/getClassInfo/{sessionId}', 'Message', 'Info básica da mensagem', bodyMessage),
  ...postWithBody('/message/getInfo/{sessionId}', 'Message', 'Detalhes completos da mensagem', bodyMessage),
  ...postWithBody('/message/getMentions/{sessionId}', 'Message', 'Contatos mencionados', bodyMessage),
  ...postWithBody('/message/getOrder/{sessionId}', 'Message', 'Pedido (se mensagem de catálogo)', bodyMessage),
  ...postWithBody('/message/getPayment/{sessionId}', 'Message', 'Pagamento (se mensagem de cobrança)', bodyMessage),
  ...postWithBody('/message/getQuotedMessage/{sessionId}', 'Message', 'Mensagem citada (reply)', bodyMessage),
  ...postWithBody('/message/downloadMedia/{sessionId}', 'Message', 'Baixar mídia anexada', bodyMessage),
  ...postWithBody('/message/star/{sessionId}', 'Message', 'Marcar como favorita', bodyMessage),
  ...postWithBody('/message/unstar/{sessionId}', 'Message', 'Desmarcar favorita', bodyMessage),

  ...postWithBody('/message/delete/{sessionId}', 'Message', 'Apagar mensagem', {
    ...bodyMessage,
    everyone: {
      type: 'boolean',
      default: false,
      description: 'Apagar para todos (true) ou só para você (false)',
      example: false
    }
  }, { required: ['messageId', 'chatId'] }),

  ...postWithBody('/message/forward/{sessionId}', 'Message', 'Encaminhar para outro chat', {
    ...bodyMessage,
    destinationChatId: {
      type: 'string',
      description: 'ID do chat de destino',
      example: '245956531010@c.us'
    }
  }),

  ...postWithBody('/message/react/{sessionId}', 'Message', 'Reagir com emoji', {
    ...bodyMessage,
    reaction: {
      type: 'string',
      description: 'Emoji único (ou vazio para remover)',
      example: '👍'
    }
  }),

  ...postWithBody('/message/reply/{sessionId}', 'Message', 'Responder citando a mensagem', {
    ...bodyMessage,
    content: { type: 'string', example: 'Ok, entendido!' },
    destinationChatId: { type: 'string', nullable: true, example: null },
    options: { type: 'object', additionalProperties: true, nullable: true }
  }, { required: ['messageId', 'chatId', 'content'] })
}