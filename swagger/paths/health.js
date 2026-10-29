// swagger/paths/health.js

module.exports = {
  '/ping': {
    get: {
      tags: ['Health'],
      summary: 'Health check',
      responses: {
        200: {
          description: 'OK',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: { type: 'string', example: 'OK' },
                  timestamp: { type: 'string', format: 'date-time' },
                  uptime: { type: 'number', example: 1234.5 }
                }
              }
            }
          }
        }
      }
    }
  },

  '/test-qr': {
    get: {
      tags: ['Health'],
      summary: 'Teste de geração de QR (sem auth)',
      responses: {
        200: { description: 'PNG de teste', content: { 'image/png': {} } }
      }
    }
  },

  '/test-qr-auth': {
    get: {
      tags: ['Health'],
      summary: 'Teste de geração de QR (com auth)',
      security: [{ bearerAuth: [] }],
      responses: { 200: { description: 'PNG', content: { 'image/png': {} } } }
    }
  },

  '/cache/status': {
    get: {
      tags: ['Health'],
      summary: 'Status do cache',
      responses: {
        200: { $ref: '#/components/responses/Success' }
      }
    }
  },

  '/cache/clear': {
    post: {
      tags: ['Health'],
      summary: 'Limpar cache',
      security: [{ serviceKey: [] }],
      responses: { 200: { $ref: '#/components/responses/Success' } }
    }
  },

  '/database/status': {
    get: {
      tags: ['Health'],
      summary: 'Status do banco de dados',
      responses: {
        200: { $ref: '#/components/responses/Success' },
        503: { description: 'Banco indisponível' }
      }
    }
  }
}