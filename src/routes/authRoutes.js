const express = require('express')
const router = express.Router()
const AuthController = require('../controllers/authController')
const { authSwagger } = require('../middleware/authMiddleware')

//  #swagger.tags = ['Auth']

router.post('/users', authSwagger, (req, res) => {
  /*  #swagger.requestBody = {
        required: true,
        content: { "application/json": { schema: {
          type: 'object',
          properties: {
            username: { type: 'string', example: 'admin' },
            password: { type: 'string', example: 'senha123' }
          },
          required: ['username', 'password']
        } } }
      }
  */
  AuthController.createUser(req, res)
})

router.post('/authenticate', authSwagger, (req, res) => {
  /*  #swagger.requestBody = {
        required: true,
        content: { "application/json": { schema: {
          type: 'object',
          properties: {
            email:    { type: 'string', example: 'user@example.com' },
            password: { type: 'string', example: 'senha123' }
          },
          required: ['email', 'password']
        } } }
      }
  */
  AuthController.authenticateUser(req, res)
})

router.post('/refresh', authSwagger, (req, res) => {
  /*  #swagger.requestBody = {
        required: true,
        content: { "application/json": { schema: {
          type: 'object',
          properties: { refreshToken: { type: 'string' } },
          required: ['refreshToken']
        } } }
      }
  */
  AuthController.refreshToken(req, res)
})

router.post('/revoke', authSwagger, (req, res) => {
  /*  #swagger.requestBody = {
        required: true,
        content: { "application/json": { schema: {
          type: 'object',
          properties: { refreshToken: { type: 'string' } },
          required: ['refreshToken']
        } } }
      }
  */
  AuthController.revokeToken(req, res)
})

router.post('/verify', authSwagger, (req, res) => {
  /*  #swagger.requestBody = {
        required: true,
        content: { "application/json": { schema: {
          type: 'object',
          properties: { token: { type: 'string' } },
          required: ['token']
        } } }
      }
  */
  AuthController.verifyToken(req, res)
})

module.exports = router