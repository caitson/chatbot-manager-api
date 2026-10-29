module.exports = {
  securitySchemes: {
    bearerAuth: {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT'
    },
    serviceKey: {
      type: 'apiKey',
      in: 'header',
      name: 'x-service-key',
      description: 'Service key para comunicação serviço-a-serviço (Webhook → API)'
    },
    adminApiKey: {
      type: 'apiKey',
      in: 'header',
      name: 'x-api-key',
      description: 'API key global para rotas administrativas (/admin/*)'
    }
  },

  responses: {
    Unauthorized: {
      description: 'Token ausente ou inválido',
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/ErrorResponse' },
          example: { success: false, error: 'Token de acesso não fornecido' }
        }
      }
    },
    Forbidden: {
      description: 'Sem permissão para acessar o recurso',
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/ErrorResponse' },
          example: { success: false, error: 'Acesso negado: sessão não pertence ao usuário' }
        }
      }
    },
    NotFound: {
      description: 'Recurso não encontrado',
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/ErrorResponse' }
        }
      }
    },
    ServerError: {
      description: 'Erro interno do servidor',
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/ErrorResponse' },
          example: { success: false, error: 'Erro interno do servidor' }
        }
      }
    },
    Success: {
      description: 'Operação realizada com sucesso',
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/SuccessResponse' }
        }
      }
    }
  },

  parameters: {
    sessionId: {
      in: 'path',
      name: 'sessionId',
      required: true,
      schema: { type: 'string' },
      description: 'ID único da sessão WhatsApp',
      example: '89bb42761512'
    },
    userId: {
      in: 'path',
      name: 'userId',
      required: true,
      schema: { type: 'string', format: 'uuid' },
      example: '4d23233f-2d9a-4840-aba3-1ec544fb9360'
    }
  },

  schemas: {
    ErrorResponse: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        error: { type: 'string', example: 'Descrição do erro' }
      }
    },
    SuccessResponse: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Operação realizada com sucesso' },
        data: { type: 'object', nullable: true }
      }
    },
    StartSessionResponse: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Session initiated successfully' }
      }
    },
    StatusSessionResponse: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        state: { type: 'string', example: 'CONNECTED' },
        message: { type: 'string', example: 'session_connected' }
      }
    },
    UserResponse: {
      type: 'object',
      properties: {
        id: { type: 'integer', example: 1 },
        user_id: { type: 'string', format: 'uuid' },
        user_name: { type: 'string', example: 'Meu App WhatsApp' },
        user_documento_identificacao: { type: 'string', nullable: true },
        description: { type: 'string', nullable: true },
        is_active: { type: 'boolean', example: true },
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' }
      }
    },
    AuthTokens: {
      type: 'object',
      properties: {
        access_token: { type: 'string', example: 'eyJhbGciOiJIUzI1...' },
        refresh_token: { type: 'string', example: 'eyJhbGciOiJIUzI1...' },
        token_type: { type: 'string', example: 'Bearer' },
        expires_in: { type: 'integer', example: 86400 },
        scope: { type: 'string', example: 'read write' }
      }
    },
    SessionConfigInput: {
      type: 'object',
      required: ['projectId', 'clientEmail', 'privateKey'],
      properties: {
        projectId: {
          type: 'string',
          description: 'ID do projeto no Google Cloud / Dialogflow',
          example: 'meu-projeto-dialogflow'
        },
        clientEmail: {
          type: 'string',
          format: 'email',
          description: 'Email da service account do Dialogflow',
          example: 'bot@meu-projeto.iam.gserviceaccount.com'
        },
        privateKey: {
          type: 'string',
          description: 'Conteúdo completo da private key (com \\n literais)',
          example: '-----BEGIN PRIVATE KEY-----\\nMIIEvgIBADANBgkq...\\n-----END PRIVATE KEY-----\\n'
        },
        language: {
          type: 'string',
          enum: ['pt', 'en', 'fr', 'es'],
          default: 'pt'
        }
      }
    }
  }
}