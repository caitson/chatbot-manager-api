// swagger/paths/auth.js

module.exports = {
  '/auth/users': {
    post: {
      tags: ['Auth'],
      summary: 'Criar novo usuário',
      description: 'Rota pública. Retorna o `user_id` e `temporary_secret` (mostrado uma vez só).',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['user_name'],
              properties: {
                user_name: { type: 'string', minLength: 3, maxLength: 100, example: 'Meu App WhatsApp' },
                user_documento_identificacao: { type: 'string', example: '123.456.789-00' },
                description: { type: 'string', maxLength: 500, example: 'App para integração' }
              }
            }
          }
        }
      },
      responses: {
        201: {
          description: 'Usuário criado',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string' },
                  data: { $ref: '#/components/schemas/UserResponse' }
                }
              }
            }
          }
        },
        400: { $ref: '#/components/responses/ServerError' },
        409: { description: 'Usuário já existe' },
        500: { $ref: '#/components/responses/ServerError' }
      }
    }
  },

  '/auth/authenticate': {
    post: {
      tags: ['Auth'],
      summary: 'Autenticar usuário',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['user_id', 'user_secret'],
              properties: {
                user_id: { type: 'string', format: 'uuid', example: '4d23233f-2d9a-4840-aba3-1ec544fb9360' },
                user_secret: { type: 'string', example: 'minha_senha_secreta_123' }
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Autenticado',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  data: { $ref: '#/components/schemas/AuthTokens' }
                }
              }
            }
          }
        },
        401: { $ref: '#/components/responses/Unauthorized' },
        500: { $ref: '#/components/responses/ServerError' }
      }
    }
  },

  '/auth/refresh': {
    post: {
      tags: ['Auth'],
      summary: 'Renovar token de acesso',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['refresh_token'],
              properties: {
                refresh_token: { type: 'string', example: 'eyJhbGciOiJIUzI1...' }
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Token renovado',
          content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthTokens' } } }
        },
        401: { $ref: '#/components/responses/Unauthorized' }
      }
    }
  },

  '/auth/revoke': {
    post: {
      tags: ['Auth'],
      summary: 'Revogar token',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['access_token'],
              properties: { access_token: { type: 'string' } }
            }
          }
        }
      },
      responses: {
        200: { $ref: '#/components/responses/Success' },
        500: { $ref: '#/components/responses/ServerError' }
      }
    }
  },

  '/auth/verify': {
    post: {
      tags: ['Auth'],
      summary: 'Verificar validade de token',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['access_token'],
              properties: { access_token: { type: 'string' } }
            }
          }
        }
      },
      responses: {
        200: { description: 'Token válido', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessResponse' } } } },
        401: { $ref: '#/components/responses/Unauthorized' }
      }
    }
  },

  '/admin/users': {
    get: {
      tags: ['Admin'],
      summary: 'Listar todos os usuários',
      security: [{ adminApiKey: [] }],
      responses: {
        200: {
          description: 'Lista de usuários',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  data: { type: 'array', items: { $ref: '#/components/schemas/UserResponse' } }
                }
              }
            }
          }
        },
        403: { $ref: '#/components/responses/Forbidden' }
      }
    }
  },

  '/admin/users/{userId}': {
    get: {
      tags: ['Admin'],
      summary: 'Obter usuário específico',
      security: [{ adminApiKey: [] }],
      parameters: [{ $ref: '#/components/parameters/userId' }],
      responses: {
        200: { description: 'Usuário', content: { 'application/json': { schema: { $ref: '#/components/schemas/UserResponse' } } } },
        404: { $ref: '#/components/responses/NotFound' }
      }
    },
    put: {
      tags: ['Admin'],
      summary: 'Atualizar usuário',
      security: [{ adminApiKey: [] }],
      parameters: [{ $ref: '#/components/parameters/userId' }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                user_name: { type: 'string' },
                user_documento_identificacao: { type: 'string' },
                description: { type: 'string' },
                is_active: { type: 'boolean' }
              }
            }
          }
        }
      },
      responses: {
        200: { description: 'Atualizado', content: { 'application/json': { schema: { $ref: '#/components/schemas/UserResponse' } } } },
        400: { $ref: '#/components/responses/ServerError' },
        404: { $ref: '#/components/responses/NotFound' }
      }
    },
    delete: {
      tags: ['Admin'],
      summary: 'Deletar usuário',
      security: [{ adminApiKey: [] }],
      parameters: [{ $ref: '#/components/parameters/userId' }],
      responses: {
        200: { $ref: '#/components/responses/Success' },
        404: { $ref: '#/components/responses/NotFound' }
      }
    }
  },

  '/admin/users/{userId}/tokens': {
    get: {
      tags: ['Admin'],
      summary: 'Listar tokens de um usuário',
      security: [{ adminApiKey: [] }],
      parameters: [{ $ref: '#/components/parameters/userId' }],
      responses: { 200: { $ref: '#/components/responses/Success' } }
    }
  },

  '/admin/users/{userId}/sessions': {
    get: {
      tags: ['Admin'],
      summary: 'Listar sessões de um usuário',
      security: [{ adminApiKey: [] }],
      parameters: [{ $ref: '#/components/parameters/userId' }],
      responses: { 200: { $ref: '#/components/responses/Success' } }
    }
  }
}