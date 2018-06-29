let routes = require('express').Router()
let spullen = require('../controller/spullen_controller')

routes.get('/:id/spullen',spullen.getAllSpullen)
routes.post('/:id/spullen',spullen.addSpullen)
routes.get('/:id/spullen/:spullid',spullen.getSpulByID)


module.exports = routes