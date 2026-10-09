const { query } = require('../database')
const { encrypt } = require('../utils/crypto')
const { sendErrorResponse } = require('../utils')
const axios = require('axios')

/**
 * Cria ou atualiza a config Dialogflow de uma sessão.
 * POST /client/sessions/:sessionId/dialogflow-config
 */
const upsertDialogflowConfig = async (req, res) => {
  const { sessionId } = req.params
  const {
    projectId,
    clientEmail,
    privateKey,
    language = 'pt'
  } = req.body || {}

  if (!projectId || !clientEmail || !privateKey) {
    return sendErrorResponse(
      res,
      400,
      'projectId, clientEmail e privateKey são obrigatórios'
    )
  }

  if (!privateKey.includes('BEGIN PRIVATE KEY')) {
    return sendErrorResponse(res, 400, 'privateKey inválida')
  }

  try {
    // ─── Confirma que a sessão existe e pertence ao user ──
    // (isso já é garantido pelo middleware requireSessionOwnership, mas
    //  deixamos explícito pra clareza)
    const sessionCheck = await query(
      'SELECT session_id FROM whatsapp_sessions WHERE session_id = $1 AND user_id = $2',
      [sessionId, req.user.user_id]
    )
    if (sessionCheck.rows.length === 0) {
      return sendErrorResponse(res, 403, 'Sessão não pertence ao usuário')
    }

    const encKey = encrypt(privateKey)

    const result = await query(
      `
      INSERT INTO session_configs (
        session_id,
        user_id,
        dialogflow_project_id,
        dialogflow_client_email,
        dialogflow_private_key_encrypted,
        dialogflow_language,
        active,
        updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, true, NOW())
      ON CONFLICT (session_id) DO UPDATE SET
        user_id                         = EXCLUDED.user_id,
        dialogflow_project_id           = EXCLUDED.dialogflow_project_id,
        dialogflow_client_email         = EXCLUDED.dialogflow_client_email,
        dialogflow_private_key_encrypted = EXCLUDED.dialogflow_private_key_encrypted,
        dialogflow_language             = EXCLUDED.dialogflow_language,
        active                          = true,
        updated_at                      = NOW()
      RETURNING id, session_id, dialogflow_project_id, dialogflow_client_email,
                dialogflow_language, active, created_at, updated_at
      `,
      [
        sessionId,
        req.user.user_id,
        projectId,
        clientEmail,
        encKey,
        language
      ]
    )

    await invalidateWebhookCache(sessionId)

    return res.json({
      success: true,
      config: result.rows[0] // note: NÃO devolve privateKey
    })
  } catch (error) {
    console.error('[sessionConfig] erro no upsert:', error)
    return sendErrorResponse(res, 500, 'Erro interno do servidor')
  }
}

/**
 * Lê a config (sem devolver a private key).
 * GET /client/sessions/:sessionId/dialogflow-config
 */
// const getDialogflowConfig = async (req, res) => {
//   const { sessionId } = req.params

//   try {
//     const result = await query(
//       `
//       SELECT id, session_id, dialogflow_project_id, dialogflow_client_email,
//              dialogflow_language, active, created_at, updated_at,
//              (dialogflow_private_key_encrypted IS NOT NULL) AS has_private_key
//       FROM session_configs
//       WHERE session_id = $1 AND user_id = $2
//       `,
//       [sessionId, req.user.user_id]
//     )

//     if (result.rows.length === 0) {
//       return res.json({ success: true, config: null })
//     }

//     return res.json({ success: true, config: result.rows[0] })
//   } catch (error) {
//     console.error('[sessionConfig] erro no get:', error)
//     return sendErrorResponse(res, 500, 'Erro interno do servidor')
//   }
// }

/**
 * Remove a config.
 * DELETE /client/sessions/:sessionId/dialogflow-config
 */
const deleteDialogflowConfig = async (req, res) => {
  const { sessionId } = req.params

  try {
    await query(
      'DELETE FROM session_configs WHERE session_id = $1 AND user_id = $2',
      [sessionId, req.user.user_id]
    )

    const { invalidateWebhookCache } = require('./sessionController')
    await invalidateWebhookCache(sessionId)

    return res.json({ success: true })
  } catch (error) {
    console.error('[sessionConfig] erro no delete:', error)
    return sendErrorResponse(res, 500, 'Erro interno do servidor')
  }
}

const getDialogflowConfig = async (req, res) => {
  const { sessionId } = req.params
  const { query } = require('../database')
  const { decrypt } = require('../utils/crypto')

  const result = await query(
    'SELECT * FROM session_configs WHERE session_id = $1 AND active = true',
    [sessionId]
  )
  if (!result.rows.length) {
    return sendErrorResponse(res, 404, 'Config Dialogflow não encontrada')
  }
  const cfg = result.rows[0]
  res.json({
    sessionId: cfg.session_id,
    projectId: cfg.dialogflow_project_id,
    clientEmail: cfg.dialogflow_client_email,
    privateKey: decrypt(cfg.dialogflow_private_key_encrypted),
    language: cfg.dialogflow_language || 'pt'
  })
}

const saveDialogflowConfig = async (req, res) => {
  const { sessionId } = req.params
  const { projectId, clientEmail, privateKey, language } = req.body

  const { encrypt } = require('../utils/crypto')
  const { query } = require('../database')
  
  const encryptedKey = encrypt(privateKey)
  
  await query(`
    INSERT INTO session_configs 
      (session_id, user_id, dialogflow_project_id, dialogflow_client_email, 
       dialogflow_private_key_encrypted, dialogflow_language)
    VALUES ($1, $2, $3, $4, $5, $6)
    ON CONFLICT (session_id) DO UPDATE SET
      dialogflow_project_id = EXCLUDED.dialogflow_project_id,
      dialogflow_client_email = EXCLUDED.dialogflow_client_email,
      dialogflow_private_key_encrypted = EXCLUDED.dialogflow_private_key_encrypted,
      dialogflow_language = EXCLUDED.dialogflow_language,
      updated_at = NOW()
  `, [sessionId, req.user.user_id, projectId, clientEmail, encryptedKey, language])
  
  // invalida cache no webhook
  await invalidateWebhookCache(sessionId)
  
  res.json({ success: true })
}

async function invalidateWebhookCache(sessionId) {
  const webhookUrl = process.env.WEBHOOK_INTERNAL_URL
  const key = process.env.SERVICE_API_KEY

  if (!webhookUrl) {
    console.warn('[api] WEBHOOK_INTERNAL_URL não configurado, cache não será invalidado')
    return
  }

  try {
    await axios.post(
      `${webhookUrl}/internal/invalidate-cache`,
      { sessionId },
      {
        headers: { 'x-service-key': key },
        timeout: 3000
      }
    )
    console.log(`[api] cache do webhook invalidado p/ sessão=${sessionId}`)
  } catch (error) {
    // Não deixa falha do webhook quebrar o save — cache expira em 5 min mesmo
    console.error(`[api] falha ao invalidar cache do webhook: ${error.message}`)
  }
}

module.exports = {
  upsertDialogflowConfig,
  getDialogflowConfig,
  deleteDialogflowConfig,
  saveDialogflowConfig
}