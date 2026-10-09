const express = require('express')
const routes = express.Router()
const swaggerUi = require('swagger-ui-express')
const { enableLocalCallbackExample, enableSwaggerEndpoint } = require('./config')
const { getSwaggerConfig } = require('../swagger-config')
const rateLimiting = require('express-rate-limit')

const middleware = require('./middleware')
const healthController = require('./controllers/healthController')
const sessionController = require('./controllers/sessionController')
const clientController = require('./controllers/clientController')
const chatController = require('./controllers/chatController')
const groupChatController = require('./controllers/groupChatController')
const messageController = require('./controllers/messageController')
const contactController = require('./controllers/contactController')
const sessionConfigController = require('./controllers/sessionConfigController')

// Importar rotas de autenticação
const authRoutes = require('./routes/authRoutes')
// Importar rotas administrativas
const adminRoutes = require('./routes/adminRoutes')
const panelRoutes = require('./panel/panelRoutes')

// Rate limiting mais rigoroso para rotas de autenticação
const authRateLimiter = rateLimiting({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // máximo 5 tentativas
  message: 'Muitas tentativas de autenticação. Tente novamente em 15 minutos.',
  standardHeaders: true,
  legacyHeaders: false
})

// DEBUG temporário
// routes.use((req, res, next) => {
//   console.log(`[REQ] ${req.method} ${req.originalUrl}`, {
//     authorization: req.headers.authorization,
//     'x-access-token': req.headers['x-access-token'],
//     cookie: req.headers.cookie
//   })
//   next()
// })

/**
 * ================
 * AUTH ENDPOINTS
 * ================
 */
routes.use('/auth', authRateLimiter, authRoutes)

/**
 * ================
 * ADMIN ENDPOINTS
 * ================
 */
routes.use('/admin', adminRoutes)

/**
 * ================
 * PANEL ENDPOINTS (front web: instâncias, conversas, SSE)
 * ================
 */
routes.use('/panel', panelRoutes)

/**
 * ================
 * HEALTH ENDPOINTS
 * ================
 */

// API endpoint to check if server is alive
routes.get('/ping', healthController.healthCheck)

// Test QR endpoint (no authentication required)
routes.get('/test-qr', healthController.testQr)

// Test QR endpoint with authentication
routes.get('/test-qr-auth', 
  middleware.checkAuthEnabled,
  middleware.requireActiveUser,
  healthController.testQrWithAuth
)

// Cache management endpoints
routes.get('/cache/status', healthController.cacheStatus)
routes.post('/cache/clear', [middleware.apikey], healthController.clearCache)

// Database status endpoint
routes.get('/database/status', healthController.databaseStatus)
// for service callback
const internalRouter = express.Router()
internalRouter.use(middleware.authAny) 
routes.use('/internal', internalRouter)

internalRouter.get(
  '/sessions/:sessionId/dialogflow-config',
  sessionConfigController.getDialogflowConfig
)

internalRouter.post(
  '/sessions/:sessionId/dialogflow-config',
  sessionConfigController.upsertDialogflowConfig
)

internalRouter.delete(
  '/sessions/:sessionId/dialogflow-config',
  sessionConfigController.deleteDialogflowConfig
)

// internalRouter.post('/sessions/:sessionId/invalidate-cache',
//   sessionConfigController.invalidateDialogflowCache
// )

// API basic callback
if (enableLocalCallbackExample) {
  routes.post('/localCallbackExample', [middleware.apikey, middleware.rateLimiter], healthController.localCallbackExample)
}

/**
 * ================
 * SESSION ENDPOINTS
 * ================
 */
const sessionRouter = express.Router()
sessionRouter.use(middleware.userAuth)
sessionRouter.use(middleware.sessionSwagger)
routes.use('/session', sessionRouter)

// Rotas que requerem autenticação e verificação de propriedade da sessão
sessionRouter.get('/start/:sessionId', 
  middleware.checkAuthEnabled,
  middleware.requireActiveUser,
  middleware.requireSessionOwnershipOrCreate,
  middleware.sessionNameValidation, 
  sessionController.startSession
)

sessionRouter.get('/status/:sessionId', 
  middleware.checkAuthEnabled,
  middleware.requireActiveUser,
  middleware.requireSessionOwnership,
  middleware.sessionNameValidation, 
  sessionController.statusSession
)

sessionRouter.get('/qr/:sessionId', 
  middleware.checkAuthEnabled,
  middleware.requireActiveUser,
  middleware.requireSessionOwnership,
  middleware.sessionNameValidation, 
  sessionController.sessionQrCode
)

sessionRouter.get('/qr/:sessionId/image', 
  middleware.checkAuthEnabled,
  middleware.requireActiveUser,
  middleware.requireSessionOwnership,
  middleware.sessionNameValidation, 
  sessionController.sessionQrCodeImage
)

sessionRouter.get('/terminate/:sessionId', 
  middleware.checkAuthEnabled,
  middleware.requireActiveUser,
  middleware.requireSessionOwnership,
  middleware.sessionNameValidation, 
  sessionController.terminateSession
)

// Rotas administrativas (requerem escopo admin)
sessionRouter.get('/terminateInactive', 
  middleware.checkAuthEnabled,
  middleware.requireActiveUser,
  middleware.requireScope('admin'),
  sessionController.terminateInactiveSessions
)

sessionRouter.get('/terminateAll', 
  middleware.checkAuthEnabled,
  middleware.requireActiveUser,
  middleware.requireScope('admin'),
  sessionController.terminateAllSessions
)

/**
 * ================
 * CLIENT ENDPOINTS
 * ================
 */

const clientRouter = express.Router()
// clientRouter.use(middleware.userAuth)
clientRouter.use(middleware.authAny)
clientRouter.use(middleware.clientSwagger)
routes.use('/client', clientRouter)

// Função para criar middleware de autenticação e verificação de sessão
const createClientMiddleware = (controllerMethod) => [
  middleware.checkAuthEnabled,
  middleware.requireActiveUser,
  middleware.requireSessionOwnership,
  middleware.sessionNameValidation,
  middleware.sessionValidation,
  controllerMethod
]

clientRouter.get('/getClassInfo/:sessionId', createClientMiddleware(clientController.getClassInfo))
clientRouter.post('/acceptInvite/:sessionId', createClientMiddleware(clientController.acceptInvite))
clientRouter.post('/archiveChat/:sessionId', createClientMiddleware(clientController.archiveChat))
clientRouter.post('/createGroup/:sessionId', createClientMiddleware(clientController.createGroup))
clientRouter.post('/getBlockedContacts/:sessionId', createClientMiddleware(clientController.getBlockedContacts))
clientRouter.post('/getChatById/:sessionId', createClientMiddleware(clientController.getChatById))
clientRouter.post('/getChatLabels/:sessionId', createClientMiddleware(clientController.getChatLabels))
clientRouter.get('/getChats/:sessionId', createClientMiddleware(clientController.getChats))
clientRouter.post('/getChatsByLabelId/:sessionId', createClientMiddleware(clientController.getChatsByLabelId))
clientRouter.post('/getCommonGroups/:sessionId', createClientMiddleware(clientController.getCommonGroups))
clientRouter.post('/getContactById/:sessionId', createClientMiddleware(clientController.getContactById))
clientRouter.get('/getContacts/:sessionId', createClientMiddleware(clientController.getContacts))
clientRouter.post('/getInviteInfo/:sessionId', createClientMiddleware(clientController.getInviteInfo))
clientRouter.post('/getLabelById/:sessionId', createClientMiddleware(clientController.getLabelById))
clientRouter.post('/getLabels/:sessionId', createClientMiddleware(clientController.getLabels))
clientRouter.post('/getNumberId/:sessionId', createClientMiddleware(clientController.getNumberId))
clientRouter.post('/isRegisteredUser/:sessionId', createClientMiddleware(clientController.isRegisteredUser))
clientRouter.post('/getProfilePicUrl/:sessionId', createClientMiddleware(clientController.getProfilePictureUrl))
clientRouter.get('/getState/:sessionId', [
  middleware.checkAuthEnabled,
  middleware.requireActiveUser,
  middleware.requireSessionOwnership,
  middleware.sessionNameValidation
], clientController.getState)
clientRouter.post('/markChatUnread/:sessionId', createClientMiddleware(clientController.markChatUnread))
clientRouter.post('/muteChat/:sessionId', createClientMiddleware(clientController.muteChat))
clientRouter.post('/pinChat/:sessionId', createClientMiddleware(clientController.pinChat))
clientRouter.post('/searchMessages/:sessionId', createClientMiddleware(clientController.searchMessages))
clientRouter.post('/sendMessage/:sessionId', createClientMiddleware(clientController.sendMessage))
clientRouter.post('/sendPresenceAvailable/:sessionId', createClientMiddleware(clientController.sendPresenceAvailable))
clientRouter.post('/sendPresenceUnavailable/:sessionId', createClientMiddleware(clientController.sendPresenceUnavailable))
clientRouter.post('/sendSeen/:sessionId', createClientMiddleware(clientController.sendSeen))
clientRouter.post('/setDisplayName/:sessionId', createClientMiddleware(clientController.setDisplayName))
clientRouter.post('/setProfilePicture/:sessionId', createClientMiddleware(clientController.setProfilePicture))
clientRouter.post('/setStatus/:sessionId', createClientMiddleware(clientController.setStatus))
clientRouter.post('/unarchiveChat/:sessionId', createClientMiddleware(clientController.unarchiveChat))
clientRouter.post('/unmuteChat/:sessionId', createClientMiddleware(clientController.unmuteChat))
clientRouter.post('/unpinChat/:sessionId', createClientMiddleware(clientController.unpinChat))
clientRouter.get('/getWWebVersion/:sessionId', createClientMiddleware(clientController.getWWebVersion))

/**
 * ================
 * CHAT ENDPOINTS
 * ================
 */
const chatRouter = express.Router()
chatRouter.use(middleware.userAuth)
chatRouter.use(middleware.chatSwagger)
routes.use('/chat', chatRouter)

// Função para criar middleware de autenticação e verificação de sessão
const createChatMiddleware = (controllerMethod) => [
  middleware.checkAuthEnabled,
  middleware.requireActiveUser,
  middleware.requireSessionOwnership,
  middleware.sessionNameValidation,
  middleware.sessionValidation,
  controllerMethod
]

chatRouter.post('/getClassInfo/:sessionId', createChatMiddleware(chatController.getClassInfo))
chatRouter.post('/clearMessages/:sessionId', createChatMiddleware(chatController.clearMessages))
chatRouter.post('/clearState/:sessionId', createChatMiddleware(chatController.clearState))
chatRouter.post('/delete/:sessionId', createChatMiddleware(chatController.deleteChat))
chatRouter.post('/fetchMessages/:sessionId', createChatMiddleware(chatController.fetchMessages))
chatRouter.post('/getContact/:sessionId', createChatMiddleware(chatController.getContact))
chatRouter.post('/sendStateRecording/:sessionId', createChatMiddleware(chatController.sendStateRecording))
chatRouter.post('/sendStateTyping/:sessionId', createChatMiddleware(chatController.sendStateTyping))

/**
 * ================
 * GROUP CHAT ENDPOINTS
 * ================
 */
const groupChatRouter = express.Router()
groupChatRouter.use(middleware.userAuth)
groupChatRouter.use(middleware.groupChatSwagger)
routes.use('/groupChat', groupChatRouter)

// Função para criar middleware de autenticação e verificação de sessão
const createGroupChatMiddleware = (controllerMethod) => [
  middleware.checkAuthEnabled,
  middleware.requireActiveUser,
  middleware.requireSessionOwnership,
  middleware.sessionNameValidation,
  middleware.sessionValidation,
  controllerMethod
]

groupChatRouter.post('/getClassInfo/:sessionId', createGroupChatMiddleware(groupChatController.getClassInfo))
groupChatRouter.post('/addParticipants/:sessionId', createGroupChatMiddleware(groupChatController.addParticipants))
groupChatRouter.post('/demoteParticipants/:sessionId', createGroupChatMiddleware(groupChatController.demoteParticipants))
groupChatRouter.post('/getInviteCode/:sessionId', createGroupChatMiddleware(groupChatController.getInviteCode))
groupChatRouter.post('/leave/:sessionId', createGroupChatMiddleware(groupChatController.leave))
groupChatRouter.post('/promoteParticipants/:sessionId', createGroupChatMiddleware(groupChatController.promoteParticipants))
groupChatRouter.post('/removeParticipants/:sessionId', createGroupChatMiddleware(groupChatController.removeParticipants))
groupChatRouter.post('/revokeInvite/:sessionId', createGroupChatMiddleware(groupChatController.revokeInvite))
groupChatRouter.post('/setDescription/:sessionId', createGroupChatMiddleware(groupChatController.setDescription))
groupChatRouter.post('/setInfoAdminsOnly/:sessionId', createGroupChatMiddleware(groupChatController.setInfoAdminsOnly))
groupChatRouter.post('/setMessagesAdminsOnly/:sessionId', createGroupChatMiddleware(groupChatController.setMessagesAdminsOnly))
groupChatRouter.post('/setSubject/:sessionId', createGroupChatMiddleware(groupChatController.setSubject))

/**
 * ================
 * MESSAGE ENDPOINTS
 * ================
 */
const messageRouter = express.Router()
messageRouter.use(middleware.userAuth)
messageRouter.use(middleware.messageSwagger)
routes.use('/message', messageRouter)

// Função para criar middleware de autenticação e verificação de sessão
const createMessageMiddleware = (controllerMethod) => [
  middleware.checkAuthEnabled,
  middleware.requireActiveUser,
  middleware.requireSessionOwnership,
  middleware.sessionNameValidation,
  middleware.sessionValidation,
  controllerMethod
]

messageRouter.post('/getClassInfo/:sessionId', createMessageMiddleware(messageController.getClassInfo))
messageRouter.post('/delete/:sessionId', createMessageMiddleware(messageController.deleteMessage))
messageRouter.post('/downloadMedia/:sessionId', createMessageMiddleware(messageController.downloadMedia))
messageRouter.post('/forward/:sessionId', createMessageMiddleware(messageController.forward))
messageRouter.post('/getInfo/:sessionId', createMessageMiddleware(messageController.getInfo))
messageRouter.post('/getMentions/:sessionId', createMessageMiddleware(messageController.getMentions))
messageRouter.post('/getOrder/:sessionId', createMessageMiddleware(messageController.getOrder))
messageRouter.post('/getPayment/:sessionId', createMessageMiddleware(messageController.getPayment))
messageRouter.post('/getQuotedMessage/:sessionId', createMessageMiddleware(messageController.getQuotedMessage))
messageRouter.post('/react/:sessionId', createMessageMiddleware(messageController.react))
messageRouter.post('/reply/:sessionId', createMessageMiddleware(messageController.reply))
messageRouter.post('/star/:sessionId', createMessageMiddleware(messageController.star))
messageRouter.post('/unstar/:sessionId', createMessageMiddleware(messageController.unstar))

/**
 * ================
 * CONTACT ENDPOINTS
 * ================
 */
const contactRouter = express.Router()
contactRouter.use(middleware.userAuth)
contactRouter.use(middleware.contactSwagger)
routes.use('/contact', contactRouter)

// Função para criar middleware de autenticação e verificação de sessão
const createContactMiddleware = (controllerMethod) => [
  middleware.checkAuthEnabled,
  middleware.requireActiveUser,
  middleware.requireSessionOwnership,
  middleware.sessionNameValidation,
  middleware.sessionValidation,
  controllerMethod
]

contactRouter.post('/getClassInfo/:sessionId', createContactMiddleware(contactController.getClassInfo))
contactRouter.post('/block/:sessionId', createContactMiddleware(contactController.block))
contactRouter.post('/getAbout/:sessionId', createContactMiddleware(contactController.getAbout))
contactRouter.post('/getChat/:sessionId', createContactMiddleware(contactController.getChat))
contactRouter.post('/unblock/:sessionId', createContactMiddleware(contactController.unblock))
contactRouter.post('/getFormattedNumber/:sessionId', createContactMiddleware(contactController.getFormattedNumber))
contactRouter.post('/getCountryCode/:sessionId', createContactMiddleware(contactController.getCountryCode))
contactRouter.post('/getProfilePicUrl/:sessionId', createContactMiddleware(contactController.getProfilePicUrl))
/**
 * ================
 * SWAGGER ENDPOINTS
 * ================
 */
if (enableSwaggerEndpoint) {

  routes.use('/api-docs', swaggerUi.serve)

  routes.get('/api-docs', (req, res) => {
    res.send(swaggerUi.generateHTML(getSwaggerConfig()))
  })

  routes.get('/api-docs/json', (req, res) => {
    res.json(getSwaggerConfig())
  })

}

module.exports = { routes }
