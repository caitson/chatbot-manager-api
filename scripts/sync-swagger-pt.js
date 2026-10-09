#!/usr/bin/env node

/**
 * Script para sincronizar a documentação Swagger em português
 * com a versão em inglês, traduzindo automaticamente
 */

const fs = require('fs')
const path = require('path')

// Função para traduzir tags
function translateTags(tags) {
  const tagTranslations = {
    'Auth': 'Autenticação',
    'Session': 'Sessão',
    'Client': 'Cliente', 
    'Message': 'Mensagem',
    'Chat': 'Chat',
    'Group Chat': 'Grupo',
    'Contact': 'Contato',
    'Various': 'Diversos'
  }

  return tags.map(tag => ({
    ...tag,
    name: tagTranslations[tag.name] || tag.name,
    description: translateDescription(tag.description)
  }))
}

// Função para traduzir descrições
function translateDescription(description) {
  const translations = {
    'Handling multiple sessions logic, creation and deletion': 'Gerenciamento de múltiplas sessões, criação e exclusão',
    'All functions related to the client': 'Todas as funções relacionadas ao cliente WhatsApp',
    'May fail if the message is too old (Only from the last 100 Messages of the given chat)': 'Pode falhar se a mensagem for muito antiga (Apenas das últimas 100 mensagens do chat)',
    'Operations related to individual chats': 'Operações relacionadas a chats individuais',
    'Operations related to WhatsApp groups': 'Operações relacionadas a grupos do WhatsApp',
    'Operations related to contacts': 'Operações relacionadas a contatos',
    'Various endpoints and utilities': 'Endpoints diversos e utilitários'
  }

  return translations[description] || description
}

// Função para traduzir summaries
function translateSummary(summary) {
  const translations = {
    'Start new session': 'Iniciar Nova Sessão',
    'Get session status': 'Obter Status da Sessão',
    'Get session QR code': 'Obter Código QR da Sessão',
    'Get session QR code as image': 'Obter Código QR da Sessão como Imagem',
    'Terminate session': 'Encerrar Sessão',
    'Terminate inactive sessions': 'Encerrar Sessões Inativas',
    'Terminate all sessions': 'Encerrar Todas as Sessões',
    'Get class info': 'Obter Informações da Classe',
    'Accept invite': 'Aceitar Convite',
    'Archive chat': 'Arquivar Chat',
    'Create group': 'Criar Grupo',
    'Get blocked contacts': 'Obter Contatos Bloqueados',
    'Get chat by ID': 'Obter Chat por ID',
    'Get chat labels': 'Obter Rótulos do Chat',
    'Get chats': 'Obter Chats',
    'Get chats by label ID': 'Obter Chats por ID do Rótulo',
    'Get common groups': 'Obter Grupos Comuns',
    'Get contact by ID': 'Obter Contato por ID',
    'Get contacts': 'Obter Contatos',
    'Get invite info': 'Obter Informações do Convite',
    'Get label by ID': 'Obter Rótulo por ID',
    'Get labels': 'Obter Rótulos',
    'Get number ID': 'Obter ID do Número',
    'Check if registered user': 'Verificar se Usuário Registrado',
    'Get profile picture URL': 'Obter URL da Foto de Perfil',
    'Get state': 'Obter Estado',
    'Mark chat as unread': 'Marcar Chat como Não Lido',
    'Mute chat': 'Silenciar Chat',
    'Pin chat': 'Fixar Chat',
    'Search messages': 'Pesquisar Mensagens',
    'Send message': 'Enviar Mensagem',
    'Send presence available': 'Enviar Presença Disponível',
    'Send presence unavailable': 'Enviar Presença Indisponível',
    'Send seen': 'Enviar Visto',
    'Set display name': 'Definir Nome de Exibição',
    'Set profile picture': 'Definir Foto de Perfil',
    'Set status': 'Definir Status',
    'Unarchive chat': 'Desarquivar Chat',
    'Unmute chat': 'Dessilenciar Chat',
    'Unpin chat': 'Desfixar Chat',
    'Get WhatsApp Web version': 'Obter Versão do WhatsApp Web',
    'Clear messages': 'Limpar Mensagens',
    'Clear state': 'Limpar Estado',
    'Delete chat': 'Excluir Chat',
    'Fetch messages': 'Buscar Mensagens',
    'Get contact': 'Obter Contato',
    'Send state recording': 'Enviar Estado Gravando',
    'Send state typing': 'Enviar Estado Digitando',
    'Add participants': 'Adicionar Participantes',
    'Demote participants': 'Rebaixar Participantes',
    'Get invite code': 'Obter Código de Convite',
    'Leave group': 'Sair do Grupo',
    'Promote participants': 'Promover Participantes',
    'Remove participants': 'Remover Participantes',
    'Revoke invite': 'Revogar Convite',
    'Set description': 'Definir Descrição',
    'Set info admins only': 'Definir Informações Apenas para Admins',
    'Set messages admins only': 'Definir Mensagens Apenas para Admins',
    'Set subject': 'Definir Assunto',
    'Delete message': 'Excluir Mensagem',
    'Download media': 'Baixar Mídia',
    'Forward message': 'Encaminhar Mensagem',
    'Get message info': 'Obter Informações da Mensagem',
    'Get mentions': 'Obter Menções',
    'Get order': 'Obter Pedido',
    'Get payment': 'Obter Pagamento',
    'Get quoted message': 'Obter Mensagem Citada',
    'React to message': 'Reagir à Mensagem',
    'Reply to message': 'Responder à Mensagem',
    'Star message': 'Favoritar Mensagem',
    'Unstar message': 'Desfavoritar Mensagem',
    'Block contact': 'Bloquear Contato',
    'Get about': 'Obter Sobre',
    'Get chat': 'Obter Chat',
    'Unblock contact': 'Desbloquear Contato',
    'Get formatted number': 'Obter Número Formatado',
    'Get country code': 'Obter Código do País',
    'Check API status': 'Verificar Status da API',
    'Local callback example': 'Exemplo de Webhook Local',
    'Cache status': 'Status do Cache',
    'Clear cache': 'Limpar Cache',
    'Criar novo usuário': 'Criar Novo Usuário',
    'Autenticar usuário': 'Autenticar Usuário',
    'Renovar token de acesso': 'Renovar Token de Acesso',
    'Revogar token de acesso': 'Revogar Token de Acesso',
    'Verificar token de acesso': 'Verificar Token de Acesso',
    'Listar todos os usuários': 'Listar Todos os Usuários',
    'Obter usuário específico': 'Obter Usuário Específico',
    'Atualizar usuário': 'Atualizar Usuário',
    'Deletar usuário': 'Deletar Usuário',
    'Listar tokens do usuário': 'Listar Tokens do Usuário',
    'Listar sessões do usuário': 'Listar Sessões do Usuário'
  }

  return translations[summary] || summary
}

// Função para traduzir descriptions
function translateDescriptions(description) {
  const translations = {
    'Starts a session for the given session ID.': 'Inicia uma nova sessão para o ID de sessão fornecido.',
    'Status of the session with the given session ID.': 'Status da sessão com o ID de sessão fornecido.',
    'QR code of the session with the given session ID.': 'Código QR da sessão com o ID de sessão fornecido.',
    'QR code as image of the session with the given session ID.': 'Código QR como imagem da sessão com o ID de sessão fornecido.',
    'Terminates the session with the given session ID.': 'Encerra a sessão com o ID de sessão fornecido.',
    'Terminates all inactive sessions.': 'Encerra todas as sessões inativas.',
    'Terminates all sessions.': 'Encerra todas as sessões.',
    'Check if the server is alive': 'Verifica se a API está funcionando corretamente',
    'Example endpoint for receiving webhooks locally (for testing)': 'Endpoint de exemplo para receber webhooks localmente (para testes)',
    'Get cache system status and statistics': 'Obter status do sistema de cache e estatísticas',
    'Clear all cache data': 'Limpar todos os dados do cache'
  }

  return translations[description] || description
}

// Função principal
function syncSwaggerPT() {
  try {
    console.log('🔄 Sincronizando documentação Swagger em português...')

    // Ler arquivo em inglês
    const enPath = path.join(__dirname, '..', 'swagger.json')
    const enContent = fs.readFileSync(enPath, 'utf8')
    const enSwagger = JSON.parse(enContent)

    // Criar versão em português
    const ptSwagger = {
      ...enSwagger,
      info: {
        ...enSwagger.info,
        title: 'WhatsApp API',
        description: 'API Wrapper para WhatsAppWebJS - Interface REST para interagir com o WhatsApp Web'
      },
      tags: translateTags(enSwagger.tags || [])
    }

    // Traduzir paths
    if (ptSwagger.paths) {
      Object.keys(ptSwagger.paths).forEach(path => {
        Object.keys(ptSwagger.paths[path]).forEach(method => {
          const endpoint = ptSwagger.paths[path][method]
          
          if (endpoint.summary) {
            endpoint.summary = translateSummary(endpoint.summary)
          }
          
          if (endpoint.description) {
            endpoint.description = translateDescriptions(endpoint.description)
          }

          // Traduzir tags
          if (endpoint.tags) {
            endpoint.tags = endpoint.tags.map(tag => {
          const tagTranslations = {
              'Auth': 'Autenticação',
              'Session': 'Sessão',
              'Client': 'Cliente',
              'Message': 'Mensagem',
              'Chat': 'Chat',
              'Group Chat': 'Grupo',
              'Contact': 'Contato',
              'Various': 'Diversos'
            };
              return tagTranslations[tag] || tag
            })
          }
        })
      })
    }

    // Salvar arquivo em português
    const ptPath = path.join(__dirname, '..', 'swagger-pt.json')
    fs.writeFileSync(ptPath, JSON.stringify(ptSwagger, null, 2), 'utf8')

    console.log('Documentação em português sincronizada com sucesso!')
    console.log(`Linhas: ${enSwagger.paths ? Object.keys(enSwagger.paths).length : 0} endpoints`)

  } catch (error) {
    console.error('❌ Erro ao sincronizar documentação:', error.message)
    process.exit(1)
  }
}

// Executar sincronização
syncSwaggerPT()