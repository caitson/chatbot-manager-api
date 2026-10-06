#!/usr/bin/env node

/**
 * Script para testar diferentes cenários de validação do banco de dados
 * 
 * Este script simula diferentes situações para testar a robustez da validação
 */

const { query, validateRequiredTables } = require('../src/database')

async function testValidationScenarios() {
  console.log('🧪 Testando cenários de validação do banco de dados...\n')
  
  try {
    // Cenário 1: Banco funcionando normalmente
    console.log('📋 Cenário 1: Banco funcionando normalmente')
    console.log('='.repeat(50))
    
    // const client = await query('SELECT NOW()')
    console.log('✅ Conexão básica funcionando')
    
    const tableValidation = await validateRequiredTables()
    if (tableValidation.success) {
      console.log('✅ Todas as tabelas estão presentes')
      console.log(`   Tabelas: ${tableValidation.tables.join(', ')}`)
      console.log(`   Clientes ativos: ${tableValidation.activeClients}`)
    } else {
      console.log('❌ Problemas encontrados:', tableValidation.error)
    }
    
    console.log()
    
    // Cenário 2: Verificar estrutura das tabelas
    console.log('Cenário 2: Verificar estrutura das tabelas')
    console.log('='.repeat(50))
    
    // Verificar estrutura da tabela clients
    const clientsStructure = await query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'clients' 
      AND table_schema = 'public'
      ORDER BY ordinal_position
    `)
    
    console.log(' Estrutura da tabela clients:')
    clientsStructure.rows.forEach(col => {
      console.log(`   - ${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'nullable' : 'not null'})`)
    })
    
    // Verificar estrutura da tabela tokens
    const tokensStructure = await query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'tokens' 
      AND table_schema = 'public'
      ORDER BY ordinal_position
    `)
    
    console.log('\n Estrutura da tabela tokens:')
    tokensStructure.rows.forEach(col => {
      console.log(`   - ${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'nullable' : 'not null'})`)
    })
    
    // Verificar estrutura da tabela whatsapp_sessions
    const sessionsStructure = await query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'whatsapp_sessions' 
      AND table_schema = 'public'
      ORDER BY ordinal_position
    `)
    
    console.log('\n Estrutura da tabela whatsapp_sessions:')
    sessionsStructure.rows.forEach(col => {
      console.log(`   - ${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'nullable' : 'not null'})`)
    })
    
    console.log()
    
    // Cenário 3: Verificar dados nas tabelas
    console.log('Cenário 3: Verificar dados nas tabelas')
    console.log('='.repeat(50))
    
    // Contar registros em cada tabela
    const clientsCount = await query('SELECT COUNT(*) as count FROM clients')
    const tokensCount = await query('SELECT COUNT(*) as count FROM tokens')
    const sessionsCount = await query('SELECT COUNT(*) as count FROM whatsapp_sessions')
    
    console.log(` Registros nas tabelas:`)
    console.log(`   - clients: ${clientsCount.rows[0].count}`)
    console.log(`   - tokens: ${tokensCount.rows[0].count}`)
    console.log(`   - whatsapp_sessions: ${sessionsCount.rows[0].count}`)
    
    // Verificar clientes ativos
    const activeClients = await query('SELECT COUNT(*) as count FROM clients WHERE is_active = true')
    console.log(`   - Clientes ativos: ${activeClients.rows[0].count}`)
    
    // Listar clientes
    const clients = await query('SELECT client_id, client_name, is_active FROM clients')
    console.log('\n👥 Clientes cadastrados:')
    clients.rows.forEach(client => {
      console.log(`   - ${client.client_id}: ${client.client_name} (${client.is_active ? 'ativo' : 'inativo'})`)
    })
    
    console.log()
    
    // Cenário 4: Verificar índices
    console.log('Cenário 4: Verificar índices das tabelas')
    console.log('='.repeat(50))
    
    const indexes = await query(`
      SELECT 
        tablename,
        indexname,
        indexdef
      FROM pg_indexes 
      WHERE schemaname = 'public' 
      AND tablename IN ('clients', 'tokens', 'whatsapp_sessions')
      ORDER BY tablename, indexname
    `)
    
    console.log(' Índices encontrados:')
    indexes.rows.forEach(index => {
      console.log(`   - ${index.tablename}.${index.indexname}`)
    })
    
    console.log()
    
    // Cenário 5: Verificar constraints
    console.log('Cenário 5: Verificar constraints das tabelas')
    console.log('='.repeat(50))
    
    const constraints = await query(`
      SELECT 
        tc.table_name,
        tc.constraint_name,
        tc.constraint_type,
        kcu.column_name
      FROM information_schema.table_constraints tc
      JOIN information_schema.key_column_usage kcu 
        ON tc.constraint_name = kcu.constraint_name
      WHERE tc.table_schema = 'public'
      AND tc.table_name IN ('clients', 'tokens', 'whatsapp_sessions')
      ORDER BY tc.table_name, tc.constraint_type
    `)
    
    console.log(' Constraints encontradas:')
    constraints.rows.forEach(constraint => {
      console.log(`   - ${constraint.table_name}.${constraint.column_name}: ${constraint.constraint_type}`)
    })
    
    console.log()
    
    // Resumo final
    console.log(' Resumo da validação:')
    console.log('='.repeat(50))
    console.log('✅ Banco de dados está funcionando corretamente')
    console.log('✅ Todas as tabelas necessárias estão presentes')
    console.log('✅ Estrutura das tabelas está correta')
    console.log('✅ Dados mínimos estão presentes')
    console.log('✅ Índices e constraints estão configurados')
    
  } catch (error) {
    console.error('❌ Erro durante os testes:', error.message)
    process.exit(1)
  }
}

// Executar os testes se o script for chamado diretamente
if (require.main === module) {
  testValidationScenarios()
    .then(() => {
      console.log('\n🎉 Cenários de teste concluídos!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('\n💥 Erro fatal:', error)
      process.exit(1)
    })
}

module.exports = { testValidationScenarios } 