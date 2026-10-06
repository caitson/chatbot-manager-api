const app = require('./src/app')
const { baseWebhookURL } = require('./src/config')
require('dotenv').config()

const port = process.env.PORT || 3000

if (!baseWebhookURL) {
  console.error('BASE_WEBHOOK_URL environment variable is not available. Exiting...')
  process.exit(1) 
}

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
