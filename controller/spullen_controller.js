const auth = require('../authentication/authentication')
const db = require('../database/db')
const ApiResponse = require('../model/ApiResponse')

function getAllSpullen(req,res){
    let token = req.get('Authorization')

    let categorieID = req.params.id || ''

    if (!token) {
        res.status(401).json(new ApiResponse(401, 'Niet geautoriseerd (geen valid token)')).end()
        return
    }

    db.query('SELECT * FROM spullen WHERE categorieID = ?',[categorieID], function(error,rows,fields){
        if(!rows[0]){
            res.status(404).json(new ApiResponse(404, 'Niet gevonden (categorieId bestaat niet)')).end()
            return
        } else {
            res.status(200).json(rows).end()
        }
    })
}

module.exports = {
    getAllSpullen
}