// swagger/index.js
const components = require('./components')
const authPaths = require('./paths/auth')
const sessionPaths = require('./paths/session')
const internalPaths = require('./paths/internal')
const healthPaths = require('./paths/health')
const clientPaths = require('./paths/client')

const chatPaths = require('./paths/chat')       
const contactPaths = require('./paths/contact')     
const groupChatPaths = require('./paths/groupChat') 
const messagePaths = require('./paths/message')


const spec = {
  openapi: '3.0.0',
  info: {
    title: 'WhatsApp API',
    description: 'API wrapper para whatsapp-web.js com autenticação JWT + Service Key e multi-sessão.',
    version: '1.1.0'
  },
  servers: [
    { url: 'http://localhost:3000', description: 'Local' }
  ],
  tags: [
    { name: 'Health', description: 'Health check e status do sistema' },
    { name: 'Auth', description: 'Autenticação e gestão de usuários' },
    { name: 'Admin', description: 'Endpoints administrativos' },
    { name: 'Session', description: 'Multi-sessão WhatsApp' },
    { name: 'Internal', description: 'Rotas internas (service key) — webhook ↔ API' },
    { name: 'Client', description: 'Operações do cliente WhatsApp' },
    { name: 'Chat', description: 'Gestão de chats' },
    { name: 'Message', description: 'Operações com mensagens' },
    { name: 'Group Chat', description: 'Gestão de grupos' },
    { name: 'Contact', description: 'Gestão de contatos' }
  ],
  paths: {
    ...healthPaths,
    ...authPaths,
    ...sessionPaths,
    ...internalPaths,
    ...clientPaths,
    ...chatPaths,
    ...messagePaths,
    ...contactPaths,
    ...groupChatPaths
  },
  components
}

module.exports = { spec }