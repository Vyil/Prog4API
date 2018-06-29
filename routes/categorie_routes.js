let routes = require('express').Router()
let catg = require('../controller/categorie_controller')

routes.get('/categorie',catg.getAllCategories)
routes.post('/categorie', catg.makeCategorie)

module.exports = routes