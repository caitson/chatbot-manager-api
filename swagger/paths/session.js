// swagger/paths/session.js

module.exports = {
  '/session/start/{sessionId}': {
    get: {
      tags: ['Session'],
      summary: 'Iniciar nova sessão',
      description: 'Cria/reinicia a sessão. Após chamar, use `/session/qr/{sessionId}` para obter o QR code.',
      security: [{ bearerAuth: [] }],
      parameters: [{ $ref: '#/components/parameters/sessionId' }],
      responses: {
        200: {
          description: 'Sessão iniciada',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/StartSessionResponse' }
            }
          }
        },
        422: { description: 'Sessão já existe ou falha ao inicializar' },
        500: { $ref: '#/components/responses/ServerError' }
      }
    }
  },

  '/session/status/{sessionId}': {
    get: {
      tags: ['Session'],
      summary: 'Status da sessão',
      security: [{ bearerAuth: [] }],
      parameters: [{ $ref: '#/components/parameters/sessionId' }],
      responses: {
        200: {
          description: 'Status',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/StatusSessionResponse' }
            }
          }
        }
      }
    }
  },

  '/session/qr/{sessionId}': {
    get: {
      tags: ['Session'],
      summary: 'Obter QR code (texto)',
      description: 'Retorna o QR como texto (para gerar imagem no cliente).',
      security: [{ bearerAuth: [] }],
      parameters: [{ $ref: '#/components/parameters/sessionId' }],
      responses: {
        200: {
          description: 'QR code em texto',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  qr: { type: 'string', example: '2@abc...xyz,def...uvw==,...' }
                }
              }
            }
          }
        }
      }
    }
  },

  '/session/qr/{sessionId}/image': {
    get: {
      tags: ['Session'],
      summary: 'Obter QR code (imagem PNG)',
      security: [{ bearerAuth: [] }],
      parameters: [{ $ref: '#/components/parameters/sessionId' }],
      responses: {
        200: {
          description: 'QR code como PNG',
          content: { 'image/png': { schema: { type: 'string', format: 'binary' } } }
        }
      }
    }
  },

  '/session/terminate/{sessionId}': {
    get: {
      tags: ['Session'],
      summary: 'Encerrar sessão',
      security: [{ bearerAuth: [] }],
      parameters: [{ $ref: '#/components/parameters/sessionId' }],
      responses: {
        200: { $ref: '#/components/responses/Success' },
        500: { $ref: '#/components/responses/ServerError' }
      }
    }
  },

  '/session/terminateInactive': {
    get: {
      tags: ['Session'],
      summary: 'Encerrar todas as sessões inativas',
      security: [{ bearerAuth: [] }],
      responses: { 200: { $ref: '#/components/responses/Success' } }
    }
  },

  '/session/terminateAll': {
    get: {
      tags: ['Session'],
      summary: 'Encerrar TODAS as sessões (admin)',
      security: [{ bearerAuth: [] }],
      responses: { 200: { $ref: '#/components/responses/Success' } }
    }
  }
}