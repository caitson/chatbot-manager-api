#!/usr/bin/env node

/**
 * Script para testar o sistema de cache
 * Uso: node scripts/test-cache.js
 */

const axios = require('axios')

// Configuração
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000'
const API_KEY = process.env.API_KEY || 'test_api_key'
const SESSION_ID = process.env.SESSION_ID || 'test-session'

// Headers padrão
const headers = {
  'Content-Type': 'application/json',
  'x-api-key': API_KEY
}

// Função para fazer requests
async function makeRequest(method, endpoint, data = null) {
  try {
    const config = {
      method,
      url: `${API_BASE_URL}${endpoint}`,
      headers,
      data
    }
    
    const response = await axios(config)
    return response.data
  } catch (error) {
    console.error(`❌ Erro em ${method} ${endpoint}:`, error.response?.data || error.message)
    return null
  }
}

// Função para medir tempo
function measureTime(fn) {
  const start = Date.now()
  return fn().then(result => {
    const end = Date.now()
    return { result, time: end - start }
  })
}

// Testes
async function runTests() {
  console.log('🧪 Iniciando testes do sistema de cache...\n')
  
  // Teste 1: Status do cache
  console.log('1️⃣ Testando status do cache...')
  const cacheStatus = await makeRequest('GET', '/cache/status')
  if (cacheStatus) {
    console.log('✅ Status do cache:', cacheStatus.cache)
  }
  
  // Teste 2: Health check
  console.log('\n2️⃣ Testando health check...')
  const health = await makeRequest('GET', '/ping')
  if (health) {
    console.log('Health check:', health.message)
    console.log('Cache status:', health.cache)
  }
  
  // Teste 3: Performance - Primeira requisição (sem cache)
  console.log('\n3️⃣ Testando performance - Primeira requisição (sem cache)...')
  const firstRequest = await measureTime(() => 
    makeRequest('GET', `/client/getContacts/${SESSION_ID}`)
  )
  
  if (firstRequest.result) {
    console.log(`Primeira requisição: ${firstRequest.time}ms`)
    console.log(`Contatos encontrados: ${firstRequest.result.contacts?.length || 0}`)
  }
  
  // Teste 4: Performance - Segunda requisição (com cache)
  console.log('\n4️⃣ Testando performance - Segunda requisição (com cache)...')
  const secondRequest = await measureTime(() => 
    makeRequest('GET', `/client/getContacts/${SESSION_ID}`)
  )
  
  if (secondRequest.result) {
    console.log(`Segunda requisição: ${secondRequest.time}ms`)
    console.log(`Contatos encontrados: ${secondRequest.result.contacts?.length || 0}`)
    
    // Calcular melhoria
    if (firstRequest.time > 0) {
      const improvement = ((firstRequest.time - secondRequest.time) / firstRequest.time * 100).toFixed(1)
      console.log(`Melhoria de performance: ${improvement}%`)
    }
  }
  
  // Teste 5: Cache de chats
  console.log('\nTestando cache de chats...')
  const chatsFirst = await measureTime(() => 
    makeRequest('GET', `/client/getChats/${SESSION_ID}`)
  )
  
  if (chatsFirst.result) {
    console.log(`Primeira requisição de chats: ${chatsFirst.time}ms`)
    console.log(`Chats encontrados: ${chatsFirst.result.chats?.length || 0}`)
  }
  
  const chatsSecond = await measureTime(() => 
    makeRequest('GET', `/client/getChats/${SESSION_ID}`)
  )
  
  if (chatsSecond.result) {
    console.log(`⏱️  Segunda requisição de chats: ${chatsSecond.time}ms`)
    
    if (chatsFirst.time > 0) {
      const improvement = ((chatsFirst.time - chatsSecond.time) / chatsFirst.time * 100).toFixed(1)
      console.log(`🚀 Melhoria de performance: ${improvement}%`)
    }
  }
  
  // Teste 6: Limpar cache
  console.log('\n6️⃣ Testando limpeza de cache...')
  const clearCache = await makeRequest('POST', '/cache/clear')
  if (clearCache) {
    console.log('✅ Cache limpo com sucesso')
  }
  
  // Teste 7: Performance após limpeza
  console.log('\nTestando performance após limpeza...')
  const afterClear = await measureTime(() => 
    makeRequest('GET', `/client/getContacts/${SESSION_ID}`)
  )
  
  if (afterClear.result) {
    console.log(`Requisição após limpeza: ${afterClear.time}ms`)
  }
  
  console.log('\nTestes concluídos!')
}

// Executar testes
runTests().catch(error => {
  console.error('❌ Erro durante os testes:', error)
  process.exit(1)
}) 