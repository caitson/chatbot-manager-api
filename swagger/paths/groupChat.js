// swagger/paths/groupChat.js
const { postWithBody } = require('../helpers')

const bodyChatId = {
  chatId: {
    type: 'string',
    description: 'ID do grupo (formato `...@g.us`)',
    example: '120363021234567890@g.us'
  }
}

const bodyChatIdContactIds = {
  ...bodyChatId,
  contactIds: {
    type: 'array',
    description: 'Lista de IDs de participantes',
    items: { type: 'string' },
    example: ['263260037222655@c.us', '245956531010@c.us']
  }
}

module.exports = {
  ...postWithBody('/groupChat/getClassInfo/{sessionId}', 'Group Chat', 'Info do grupo', bodyChatId),
  ...postWithBody('/groupChat/addParticipants/{sessionId}', 'Group Chat', 'Adicionar participantes', bodyChatIdContactIds),
  ...postWithBody('/groupChat/removeParticipants/{sessionId}', 'Group Chat', 'Remover participantes', bodyChatIdContactIds),
  ...postWithBody('/groupChat/promoteParticipants/{sessionId}', 'Group Chat', 'Promover a admin', bodyChatIdContactIds),
  ...postWithBody('/groupChat/demoteParticipants/{sessionId}', 'Group Chat', 'Rebaixar admin', bodyChatIdContactIds),
  ...postWithBody('/groupChat/getInviteCode/{sessionId}', 'Group Chat', 'Obter código de convite', bodyChatId),
  ...postWithBody('/groupChat/revokeInvite/{sessionId}', 'Group Chat', 'Revogar convite (gera novo)', bodyChatId),
  ...postWithBody('/groupChat/leave/{sessionId}', 'Group Chat', 'Sair do grupo', bodyChatId),

  ...postWithBody('/groupChat/setSubject/{sessionId}', 'Group Chat', 'Alterar nome do grupo', {
    ...bodyChatId,
    subject: { type: 'string', example: 'Equipe de Suporte' }
  }),

  ...postWithBody('/groupChat/setDescription/{sessionId}', 'Group Chat', 'Alterar descrição do grupo', {
    ...bodyChatId,
    description: { type: 'string', example: 'Canal oficial de suporte' }
  }),

  ...postWithBody('/groupChat/setInfoAdminsOnly/{sessionId}', 'Group Chat', 'Restringir edição de info a admins', {
    ...bodyChatId,
    adminsOnly: { type: 'boolean', example: true }
  }),

  ...postWithBody('/groupChat/setMessagesAdminsOnly/{sessionId}', 'Group Chat', 'Restringir envio de msgs a admins', {
    ...bodyChatId,
    adminsOnly: { type: 'boolean', example: true }
  })
}