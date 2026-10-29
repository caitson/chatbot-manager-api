module.exports = {
  '/internal/sessions/{sessionId}/config': {
    get: {
      tags: ['Internal'],
      summary: 'Buscar config Dialogflow (com privateKey — uso interno do webhook)',
      security: [{ serviceKey: [] }],
      parameters: [{ $ref: '#/components/parameters/sessionId' }],
      responses: {
        200: {
          description: 'Config com privateKey DESCRIPTOGRAFADA',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  sessionId: { type: 'string' },
                  projectId: { type: 'string' },
                  clientEmail: { type: 'string' },
                  privateKey: { type: 'string' },
                  language: { type: 'string' }
                }
              }
            }
          }
        },
        401: { $ref: '#/components/responses/Unauthorized' },
        404: { $ref: '#/components/responses/NotFound' }
      }
    }
  },

  '/internal/sessions/{sessionId}/dialogflow-config': {
    get: {
      tags: ['Internal'],
      summary: 'Ler config (sem privateKey — uso do painel)',
      security: [{ bearerAuth: [] }, { serviceKey: [] }],
      parameters: [{ $ref: '#/components/parameters/sessionId' }],
      responses: { 200: { $ref: '#/components/responses/Success' } }
    }
  }
}