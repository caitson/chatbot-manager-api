## Stack
- Front: React (Vite) + ? (Tailwind, shadcn, MUI?)
- Back: http://localhost:3000 (Express + Postgres + Redis)
- Webhook: http://localhost:8080

## Auth
- Login: POST /auth/authenticate
  body: { user_id, user_secret }
  retorna: { access_token, refresh_token, expires_in }
- Header: Authorization: Bearer <token>
- Renova: POST /auth/refresh com refresh_token

## Multi-tenancy
- Cada user só vê SUAS sessões
- session_configs (Dialogflow) por sessão
- Todos os endpoints de /client, /chat, /message, /contact levam :sessionId na URL

## Swagger
- http://localhost:3000/api-docs (UI)
- http://localhost:3000/api-docs/json (importar no Postman)