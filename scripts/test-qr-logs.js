const axios = require('axios')

// Configurações
const BASE_URL = 'http://localhost:3000'
const API_KEY = 'test_api_key'
const SESSION_ID = 'test-qr-logs'

async function testQRLogs() {
  console.log('🧪 Iniciando teste de logs de QR code...\n')
  
  try {
    // 1. Iniciar sessão
    console.log('1️⃣ Iniciando sessão...')
    const startResponse = await axios.post(`${BASE_URL}/session/start/${SESSION_ID}`, {}, {
      headers: { 'x-api-key': API_KEY }
    })
    console.log('✅ Sessão iniciada:', startResponse.data)
    
    // Aguardar um pouco para o QR ser gerado
    console.log('\n⏳ Aguardando geração do QR code...')
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    // 2. Tentar obter QR code em texto
    console.log('\n2️⃣ Obtendo QR code em texto...')
    try {
      const qrTextResponse = await axios.get(`${BASE_URL}/session/qr/${SESSION_ID}`, {
        headers: { 'x-api-key': API_KEY }
      })
      console.log('✅ QR code em texto:', qrTextResponse.data)
    } catch (error) {
      console.log('⚠️ QR code em texto não disponível:', error.response?.data || error.message)
    }
    
    // 3. Tentar obter QR code como imagem
    console.log('\n3️⃣ Obtendo QR code como imagem...')
    try {
      const qrImageResponse = await axios.get(`${BASE_URL}/session/qr/${SESSION_ID}/image`, {
        headers: { 'x-api-key': API_KEY },
        responseType: 'arraybuffer'
      })
      console.log('QR code como imagem obtido')
      console.log(`Tamanho da imagem: ${qrImageResponse.data.length} bytes`)
      console.log(`Content-Type: ${qrImageResponse.headers['content-type']}`)
    } catch (error) {
      console.log('⚠️ QR code como imagem não disponível:', error.response?.data || error.message)
    }
    
    // 4. Verificar status da sessão
    console.log('\n4️⃣ Verificando status da sessão...')
    const statusResponse = await axios.get(`${BASE_URL}/session/status/${SESSION_ID}`, {
      headers: { 'x-api-key': API_KEY }
    })
    console.log('✅ Status da sessão:', statusResponse.data)
    
    // 5. Terminar sessão
    console.log('\n5️⃣ Terminando sessão...')
    const terminateResponse = await axios.get(`${BASE_URL}/session/terminate/${SESSION_ID}`, {
      headers: { 'x-api-key': API_KEY }
    })
    console.log('✅ Sessão terminada:', terminateResponse.data)
    
  } catch (error) {
    console.error('❌ Erro durante o teste:', error.message)
    if (error.response) {
      console.error('📋 Resposta do servidor:', error.response.data)
    }
  }
  
  console.log('\n🏁 Teste concluído!')
  console.log('\n📝 Verifique os logs do servidor para ver as mensagens detalhadas sobre:')
  console.log('   - Geração do QR code')
  console.log('   - Requisições de QR code')
  console.log('   - Status da sessão')
  console.log('   - Tamanho e formato dos dados')
}

// Executar teste
if (require.main === module) {
  testQRLogs()
}

module.exports = { testQRLogs } 