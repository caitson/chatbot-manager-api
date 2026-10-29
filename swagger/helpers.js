// swagger/helpers.js

/**
 * Endpoint POST simples com body e resposta genérica.
 */
function postWithBody(path, tag, summary, bodyProps, opts = {}) {
  const required = opts.required || Object.keys(bodyProps)
  return {
    [path]: {
      post: {
        tags: [tag],
        summary,
        security: [{ bearerAuth: [] }, { serviceKey: [] }],
        parameters: [{ $ref: '#/components/parameters/sessionId' }],
        requestBody: opts.noBody
          ? undefined
          : {
              required: true,
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    required,
                    properties: bodyProps
                  }
                }
              }
            },
        responses: {
          200: { $ref: '#/components/responses/Success' },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          500: { $ref: '#/components/responses/ServerError' }
        }
      }
    }
  }
}

/**
 * Endpoint GET simples.
 */
function getSimple(path, tag, summary, opts = {}) {
  return {
    [path]: {
      get: {
        tags: [tag],
        summary,
        security: [{ bearerAuth: [] }, { serviceKey: [] }],
        parameters: [{ $ref: '#/components/parameters/sessionId' }],
        responses: {
          200: { $ref: '#/components/responses/Success' },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          500: { $ref: '#/components/responses/ServerError' }
        }
      }
    }
  }
}

/**
 * Endpoint GET que devolve imagem (QR).
 */
function getImage(path, tag, summary) {
  return {
    [path]: {
      get: {
        tags: [tag],
        summary,
        security: [{ bearerAuth: [] }, { serviceKey: [] }],
        parameters: [{ $ref: '#/components/parameters/sessionId' }],
        responses: {
          200: {
            description: 'Imagem PNG',
            content: { 'image/png': { schema: { type: 'string', format: 'binary' } } }
          },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' }
        }
      }
    }
  }
}

module.exports = { postWithBody, getSimple, getImage }