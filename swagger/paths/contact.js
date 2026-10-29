// swagger/paths/contact.js
const { postWithBody } = require('../helpers')

const bodyContactId = {
  contactId: {
    type: 'string',
    description: 'ID do contato no formato `número@c.us`',
    example: '263260037222655@c.us'
  }
}

module.exports = {
  ...postWithBody('/contact/getClassInfo/{sessionId}', 'Contact', 'Info do contato', bodyContactId),
  ...postWithBody('/contact/getAbout/{sessionId}', 'Contact', 'Ver "recado" do contato', bodyContactId),
  ...postWithBody('/contact/getChat/{sessionId}', 'Contact', 'Obter chat do contato', bodyContactId),
  ...postWithBody('/contact/getFormattedNumber/{sessionId}', 'Contact', 'Número formatado (legível)', bodyContactId),
  ...postWithBody('/contact/getCountryCode/{sessionId}', 'Contact', 'Código do país do contato', bodyContactId),
  ...postWithBody('/contact/getProfilePicUrl/{sessionId}', 'Contact', 'URL da foto de perfil', bodyContactId),
  ...postWithBody('/contact/block/{sessionId}', 'Contact', 'Bloquear contato', bodyContactId),
  ...postWithBody('/contact/unblock/{sessionId}', 'Contact', 'Desbloquear contato', bodyContactId)
}