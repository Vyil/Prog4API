let routes = require('express').Router()
let spullen = require('../controller/spullen_controller')

routes.get('/:id/spullen',spullen.getAllSpullen)


module.exports = routes