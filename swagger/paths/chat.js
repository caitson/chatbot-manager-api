// swagger/paths/chat.js
const { postWithBody } = require('../helpers')

const bodyChatId = {
  chatId: {
    type: 'string',
    description: 'ID do chat (pessoa: `@c.us`, grupo: `@g.us`)',
    example: '263260037222655@c.us'
  }
}

module.exports = {
  ...postWithBody('/chat/getClassInfo/{sessionId}', 'Chat', 'Info do chat', bodyChatId),
  ...postWithBody('/chat/clearMessages/{sessionId}', 'Chat', 'Apagar todas as mensagens do chat', bodyChatId),
  ...postWithBody('/chat/clearState/{sessionId}', 'Chat', 'Parar de digitar/gravar no chat', bodyChatId),
  ...postWithBody('/chat/delete/{sessionId}', 'Chat', 'Apagar o chat', bodyChatId),
  ...postWithBody('/chat/getContact/{sessionId}', 'Chat', 'Obter contato do chat', bodyChatId),
  ...postWithBody('/chat/sendStateRecording/{sessionId}', 'Chat', 'Mostrar "gravando áudio…"', bodyChatId),
  ...postWithBody('/chat/sendStateTyping/{sessionId}', 'Chat', 'Mostrar "digitando…"', bodyChatId),

  ...postWithBody('/chat/fetchMessages/{sessionId}', 'Chat', 'Buscar mensagens do chat', {
    ...bodyChatId,
    searchOptions: {
      type: 'object',
      description: 'Opções de busca (ex: `{ "limit": 50 }`)',
      properties: {
        limit: { type: 'integer', default: 50, example: 50 }
      },
      example: { limit: 50 }
    }
  }, { required: ['chatId'] })
}