let routes = require('express').Router()
let spullen = require('../controller/spullen_controller')

routes.get('/:id/spullen',spullen.getAllSpullen)
routes.post('/:id/spullen',spullen.addSpullen)
routes.get('/:id/spullen/:spullid',spullen.getSpulByID)
routes.put('/:id/spullen/:spullid',spullen.editSpul)
routes.delete('/:id/spullen/:spullid',spullen.deleteSpul)


module.exports = routes