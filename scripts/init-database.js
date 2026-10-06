#!/usr/bin/env node

const { query } = require('../src/database')
const AuthService = require('../src/auth/authService')

async function initializeDatabase() {
  console.log('🔧 Inicializando banco de dados...')
  
  try {
    // Testar conexão
    const result = await query('SELECT NOW() as current_time')
    console.log('✅ Conexão com PostgreSQL estabelecida:', result.rows[0].current_time)
    
    // Verificar se as tabelas existem
    const tablesResult = await query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('users', 'tokens', 'whatsapp_sessions')
    `)
    
    console.log('📋 Tabelas encontradas:', tablesResult.rows.map(row => row.table_name))
    
    // Verificar se existe usuário padrão
    const defaultUser = await AuthService.getUserById('default_user')
    if (!defaultUser) {
      console.log('👤 Criando usuário padrão...')
      const newUser = await AuthService.createUser('Usuário Padrão', 'Usuário padrão para testes')
      console.log('✅ Usuário padrão criado:', newUser.user_id)
    } else {
      console.log('✅ Usuário padrão já existe')
    }
    
    // Limpar tokens expirados
    const cleanedTokens = await AuthService.cleanupExpiredTokens()
    console.log(`🧹 ${cleanedTokens} tokens expirados removidos`)
    
    console.log('🎉 Banco de dados inicializado com sucesso!')
    
  } catch (error) {
    console.error('❌ Erro ao inicializar banco de dados:', error)
    process.exit(1)
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  initializeDatabase()
    .then(() => {
      console.log('✅ Script concluído')
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ Erro no script:', error)
      process.exit(1)
    })
}

module.exports = { initializeDatabase } 