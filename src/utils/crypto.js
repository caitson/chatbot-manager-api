const crypto = require('crypto')

// const KEY = Buffer.from(process.env.MASTER_ENCRYPTION_KEY, 'hex') // 32 bytes

const rawKey = process.env.MASTER_ENCRYPTION_KEY

if (!rawKey) {
  throw new Error('MASTER_ENCRYPTION_KEY não definida no .env')
}

if (!/^[0-9a-fA-F]{64}$/.test(rawKey)) {
  throw new Error(
    `MASTER_ENCRYPTION_KEY inválida: esperado 64 caracteres hex, recebido ${rawKey.length} chars`
  )
}

const KEY = Buffer.from(rawKey, 'hex')

if (KEY.length !== 32) {
  throw new Error(`MASTER_ENCRYPTION_KEY gerou ${KEY.length} bytes, esperado 32`)
}

function encrypt(plaintext) {
  const iv = crypto.randomBytes(12)
  const cipher = crypto.createCipheriv('aes-256-gcm', KEY, iv)
  const enc = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()])
  const tag = cipher.getAuthTag()
  return `${iv.toString('hex')}:${tag.toString('hex')}:${enc.toString('hex')}`
}

function decrypt(payload) {
  const [ivHex, tagHex, dataHex] = payload.split(':')
  const decipher = crypto.createDecipheriv('aes-256-gcm', KEY, Buffer.from(ivHex, 'hex'))
  decipher.setAuthTag(Buffer.from(tagHex, 'hex'))
  return Buffer.concat([
    decipher.update(Buffer.from(dataHex, 'hex')),
    decipher.final()
  ]).toString('utf8')
}

module.exports = { encrypt, decrypt }