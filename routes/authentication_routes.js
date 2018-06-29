let routes = require('express').Router()
let auth = require('../controller/auth_controller')

routes.post('/login', auth.login)

module.exports = routes