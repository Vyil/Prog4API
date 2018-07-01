let routes = require('express').Router()
let delers= require('../controller/delers_controller')


routes.get('/:id/spullen/:spullid/delers', delers.getAllDelers)
routes.post('/:id/spullen/:spullid/delers',delers.meldAan)
routes.delete('/:id/spullen/:spullid/delers',delers.deleteDeler)

module.exports = routes