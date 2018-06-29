let routes = require('express').Router()
let catg = require('../controller/categorie_controller')

routes.get('/',catg.getAllCategories)
routes.post('/', catg.makeCategorie)
routes.get('/:id',catg.getCategorieByID)
routes.put('/:id',catg.editCategorie)

module.exports = routes