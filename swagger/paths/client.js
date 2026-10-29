// swagger/paths/client.js
const { postWithBody, getSimple } = require('../helpers')

module.exports = {
  // ─── Endpoints GET simples ──────────────────────────
  ...getSimple('/client/getClassInfo/{sessionId}', 'Client', 'Obter info da sessão (nome, número, etc)'),
  ...getSimple('/client/getChats/{sessionId}', 'Client', 'Listar todos os chats'),
  ...getSimple('/client/getContacts/{sessionId}', 'Client', 'Listar todos os contatos'),
  ...getSimple('/client/getState/{sessionId}', 'Client', 'Obter estado atual da conexão'),

  // ─── Endpoints POST com body ────────────────────────
  ...postWithBody('/client/sendMessage/{sessionId}', 'Client', 'Enviar mensagem', {
    chatId: { type: 'string', example: '263260037222655@lid' },
    contentType: {
      type: 'string',
      enum: ['string', 'MessageMedia', 'MessageMediaFromURL', 'Location', 'Buttons', 'List', 'Contact', 'Poll'],
      default: 'string'
    },
    content: { type: 'string', example: 'Olá! Como posso ajudar?' },
    options: { type: 'object', additionalProperties: true }
  }),

  ...postWithBody('/client/acceptInvite/{sessionId}', 'Client', 'Aceitar convite de grupo', {
    inviteCode: { type: 'string', example: 'ABC123XYZ' }
  }),

  ...postWithBody('/client/archiveChat/{sessionId}', 'Client', 'Arquivar chat', {
    chatId: { type: 'string', example: '263260037222655@c.us' }
  }),

  ...postWithBody('/client/createGroup/{sessionId}', 'Client', 'Criar grupo', {
    name: { type: 'string', example: 'Meu Grupo' },
    participants: {
      type: 'array',
      items: { type: 'string' },
      example: ['263260037222655@c.us', '245956531010@c.us']
    }
  }),

  ...postWithBody('/client/getBlockedContacts/{sessionId}', 'Client', 'Listar contatos bloqueados', {}, { noBody: true }),

  ...postWithBody('/client/getChatById/{sessionId}', 'Client', 'Obter chat por ID', {
    chatId: { type: 'string', example: '263260037222655@c.us' }
  }),

  ...postWithBody('/client/getChatLabels/{sessionId}', 'Client', 'Obter labels de um chat', {
    chatId: { type: 'string', example: '263260037222655@c.us' }
  }),

  ...postWithBody('/client/getChatsByLabelId/{sessionId}', 'Client', 'Listar chats por label', {
    labelId: { type: 'string', example: '1' }
  }),

  ...postWithBody('/client/getCommonGroups/{sessionId}', 'Client', 'Grupos em comum com um contato', {
    contactId: { type: 'string', example: '263260037222655@c.us' }
  }),

  ...postWithBody('/client/getContactById/{sessionId}', 'Client', 'Obter contato por ID', {
    contactId: { type: 'string', example: '263260037222655@c.us' }
  }),

  ...postWithBody('/client/getInviteInfo/{sessionId}', 'Client', 'Info de um convite', {
    inviteCode: { type: 'string', example: 'ABC123XYZ' }
  }),

  ...postWithBody('/client/getLabelById/{sessionId}', 'Client', 'Obter label por ID', {
    labelId: { type: 'string', example: '1' }
  }),

  ...postWithBody('/client/getLabels/{sessionId}', 'Client', 'Listar todas as labels', {}, { noBody: true }),

  ...postWithBody('/client/getNumberId/{sessionId}', 'Client', 'Obter ID do WhatsApp para um número', {
    number: { type: 'string', example: '245956531010' }
  }),

  ...postWithBody('/client/isRegisteredUser/{sessionId}', 'Client', 'Verificar se número tem WhatsApp', {
    number: { type: 'string', example: '245956531010' }
  }),

  ...postWithBody('/client/getProfilePicUrl/{sessionId}', 'Client', 'Obter URL da foto de perfil', {
    contactId: { type: 'string', example: '263260037222655@c.us' }
  }),

  ...postWithBody('/client/markChatUnread/{sessionId}', 'Client', 'Marcar chat como não lido', {
    chatId: { type: 'string', example: '263260037222655@c.us' }
  }),

  ...postWithBody('/client/muteChat/{sessionId}', 'Client', 'Silenciar chat', {
    chatId: { type: 'string', example: '263260037222655@c.us' },
    unmuteDate: { type: 'string', format: 'date-time', nullable: true, description: 'Deixe vazio para silenciar para sempre' }
  }, { required: ['chatId'] }),

  ...postWithBody('/client/pinChat/{sessionId}', 'Client', 'Fixar chat', {
    chatId: { type: 'string', example: '263260037222655@c.us' }
  }),

  ...postWithBody('/client/searchMessages/{sessionId}', 'Client', 'Buscar mensagens', {
    query: { type: 'string', example: 'olá' },
    options: { type: 'object', additionalProperties: true, nullable: true }
  }, { required: ['query'] }),

  ...postWithBody('/client/sendPresenceAvailable/{sessionId}', 'Client', 'Marcar como disponível', {}, { noBody: true }),
  ...postWithBody('/client/sendPresenceUnavailable/{sessionId}', 'Client', 'Marcar como indisponível', {}, { noBody: true }),

  ...postWithBody('/client/sendSeen/{sessionId}', 'Client', 'Marcar mensagens como vistas', {
    chatId: { type: 'string', example: '263260037222655@c.us' }
  }),

  ...postWithBody('/client/setDisplayName/{sessionId}', 'Client', 'Alterar nome do perfil', {
    displayName: { type: 'string', example: 'Meu Bot' }
  }),

  ...postWithBody('/client/setProfilePicture/{sessionId}', 'Client', 'Alterar foto de perfil', {
    pictureMimetype: { type: 'string', example: 'image/png' },
    pictureData: { type: 'string', description: 'base64 sem prefixo', example: 'iVBORw0KGgoAAAANSUhEUg...' }
  }),

  ...postWithBody('/client/setStatus/{sessionId}', 'Client', 'Alterar status (recado)', {
    status: { type: 'string', example: 'Disponível das 9h às 18h' }
  }),

  ...postWithBody('/client/unarchiveChat/{sessionId}', 'Client', 'Desarquivar chat', {
    chatId: { type: 'string', example: '263260037222655@c.us' }
  }),

  ...postWithBody('/client/unmuteChat/{sessionId}', 'Client', 'Dessilenciar chat', {
    chatId: { type: 'string', example: '263260037222655@c.us' }
  }),

  ...postWithBody('/client/unpinChat/{sessionId}', 'Client', 'Desafixar chat', {
    chatId: { type: 'string', example: '263260037222655@c.us' }
  }),

  ...getSimple('/client/getWWebVersion/{sessionId}', 'Client', 'Obter versão do WhatsApp Web')
}