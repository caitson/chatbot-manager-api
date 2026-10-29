// chatbot-manager-api/swagger-config.js

const components = require('./swagger/components')
const authPaths = require('./swagger/paths/auth')
const sessionPaths = require('./swagger/paths/session')
const clientPaths = require('./swagger/paths/client')
// const internalPaths = require('./swagger/paths/internal')
// const healthPaths = require('./swagger/paths/health')

const spec = {
  openapi: '3.0.0',
  info: {
    title: 'WhatsApp API',
    description: 'API Wrapper para whatsapp-web.js com autenticação e multi-sessão.',
    version: '1.1.0'
  },
  servers: [{ url: 'http://localhost:3000', description: 'Servidor Local' }],
  tags: [
    { name: 'Auth', description: 'Autenticação e gestão de utilizadores' },
    { name: 'Session', description: 'Gestão de múltiplas sessões' },
    { name: 'Client', description: 'Operações do cliente WhatsApp' },
    { name: 'Internal', description: 'Rotas internas para Webhooks e Serviços' },
    { name: 'Health', description: 'Estado do sistema' }
  ],
  paths: {
    ...authPaths,
    ...sessionPaths,
    ...clientPaths
    // ...internalPaths,
    // ...healthPaths
  },
  components
}

module.exports = { getSwaggerConfig: () => spec }