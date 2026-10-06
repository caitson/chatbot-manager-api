const swaggerAutogen = require('swagger-autogen')({ openapi: '3.0.0', autoBody: true })

const outputFile = './swagger.json'

const endpointsFiles = [
  './src/routes.js',
  './src/routes/authRoutes.js',
  './src/routes/adminRoutes.js',
  './src/panel/panelRoutes.js',
  './src/routes/userRoutes.js',
  './src/controllers/clientController.js',     
  './src/controllers/messageController.js',     
  './src/controllers/chatController.js',        
  './src/controllers/healthController.js',     
  './src/controllers/contactController.js',     
  './src/controllers/groupChatController.js',    
  './src/controllers/sessionController.js',     
  './src/controllers/authController.js'
]

const doc = {
  info: {
    title: 'WhatsApp API',
    description: 'API Wrapper for WhatsAppWebJS - Rotas de Usuário (Bearer Token)'
  },
  host: '',
  securityDefinitions: {
    bearerAuth: {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT'
    }
  },
  produces: ['application/json'],
  tags: [
    {
      name: 'Health',
      description: 'Health check and system status endpoints'
    },
    {
      name: 'Auth',
      description: 'Authentication and user management endpoints'
    },
    {
      name: 'Session',
      description: 'Handling multiple sessions logic, creation and deletion'
    },
    {
      name: 'Client',
      description: 'All functions related to the client'
    },
    {
      name: 'Message',
      description: 'May fail if the message is too old (Only from the last 100 Messages of the given chat)'
    },
    {
      name: 'Chat',
      description: 'Chat management and operations'
    },
    {
      name: 'Group Chat',
      description: 'Group chat management and operations'
    },
    {
      name: 'Contact',
      description: 'Contact management and operations'
    }
  ],
  definitions: {
    StartSessionResponse: {
      success: true,
      message: 'Session initiated successfully'
    },
    StatusSessionResponse: {
      success: true,
      state: 'CONNECTED',
      message: 'session_connected'
    },
    TerminateSessionResponse: {
      success: true,
      message: 'Logged out successfully'
    },
    TerminateSessionsResponse: {
      success: true,
      message: 'Flush completed successfully'
    },
    ErrorResponse: {
      success: false,
      error: 'Some server error'
    },
    NotFoundResponse: {
      success: false,
      error: 'Some server error'
    },
    ForbiddenResponse: {
      success: false,
      error: 'Invalid API key'
    },
    UnauthorizedResponse: {
      success: false,
      error: 'Unauthorized - Invalid or missing authentication token'
    }
  }
}

swaggerAutogen(outputFile, endpointsFiles, doc)
