const auth = require('../authentication/authentication')
const db = require('../database/db')
const ApiResponse = require('../model/ApiResponse')

function getAllCategories(req, res) {
    let token = req.get('Authorization')

    if (!token) {
        res.status(401).json(new ApiResponse(401, 'Niet geautoriseerd (geen valid token)')).end()
        return
    }

    db.query('SELECT * FROM categorie', function (error, rows, fields) {
        if (error) {
            res.status(500).json(new ApiResponse(500, error)).end()
        } else {
            res.status(200).json(new ApiResponse(200, rows)).end()
        }
    })
}

function makeCategorie(req, res) {

    let naam = req.body.naam || ''
    let beschrijving = req.body.beschrijving || ''
    let token = req.get('Authorization')
    let removeBearer = token.substr(7)
    let id = auth.decodeToken(removeBearer)

    if (!token) {
        res.status(401).json(new ApiResponse(401, 'Niet geautoriseerd (geen valid token)')).end()
        return
    }

    if (!naam || naam == '' || !beschrijving || beschrijving == '') {
        res.status(412).json(new ApiResponse(412, 'Een of meer properties in de request body ontbreken of zijn foutief')).end()
        return
    }

    let query = {
        sql: 'INSERT INTO categorie (Naam, Beschrijving, UserID) VALUES (?,?,?)',
        values: [naam, beschrijving, id.sub],
        timeout: 3000
    }

    db.query('SELECT * FROM categorie WHERE Naam = ?', [naam], function (error, rows, fields) {
        if (rows.length > 0) {
            res.status(401).json(new ApiResponse(401, 'Categorie bestaat al')).end()
            return
        } else {
            db.query(query, function (error, rows, fields) {
                if (error) {
                    res.status(500).json(new ApiResponse(500, error)).end()
                } else {
                    db.query('SELECT * FROM user WHERE ID = ?', [id.sub], function (err, row, field) {
                        if (error) {
                            res.status(500).json(new ApiResponse(500, error)).end()
                        }
                        let returnObject = {
                            "ID": id.sub,
                            "naam": naam,
                            "beschrijving": beschrijving,
                            "beheerder": row[0].Voornaam,
                            "email": row[0].Email
                        }
                        res.status(200).json(new ApiResponse(200, returnObject)).end()
                    })
                }
            })
        }
    })
}

function getCategorieByID(req, res) {
    let token = req.get('Authorization')
    let removeBearer = token.substr(7)
    let id = auth.decodeToken(removeBearer)

    if (!token) {
        res.status(401).json(new ApiResponse(401, 'Niet geautoriseerd (geen valid token)')).end()
        return
    }

    let urlID = req.params.id

    db.query('SELECT * FROM categorie WHERE ID = ?', [urlID], function (error, rows, fields) {
        if (!rows[0]) {
            res.status(404).json(new ApiResponse(404, 'Niet gevonden (categorieId bestaat niet)')).end()
        } else {
            db.query('SELECT * FROM user WHERE ID = ?', [rows[0].UserID], function (err, row, field) {

                let responseObject = {
                    "ID ": urlID,
                    "naam ": rows[0].Naam,
                    "beschrijving ": rows[0].Beschrijving,
                    "beheerder ": row[0].Voornaam,
                    "email ": row[0].Email
                }
                res.status(200).json(new ApiResponse(200, responseObject)).end()
            })
        }
    })
}

function editCategorie(req, res) {
    let token = req.get('Authorization')
    let removeBearer = token.substr(7)
    let id = auth.decodeToken(removeBearer)

    let categorieID = req.params.id || ''
    let naam = req.body.naam || ''
    let beschrijving = req.body.beschrijving || ''

    if(!naam || naam ==''|| !beschrijving || beschrijving==''|| !categorieID || categorieID == ''){
        res.status(412).json(new ApiResponse(412, 'Een of meer properties in de request body ontbreken of zijn foutief')).end()
        return
    }

    if (!token) {
        res.status(401).json(new ApiResponse(401, 'Niet geautoriseerd (geen valid token)')).end()
        return
    }

    db.query('SELECT * FROM categorie WHERE ID = ?', [categorieID], function (error, rows, fields) {
        if(!rows[0]){
            res.status(404).json(new ApiResponse(404, 'Niet gevonden (categorieId bestaat niet)')).end()
            return
        }
        if (!rows[0].UserID == id.sub) {
            res.status(401).json(new ApiResponse(401, 'Niet geautoriseerd (geen valid token)')).end()
            return
        } else {
            let query = {
                sql: 'UPDATE categorie SET Naam = ?, Beschrijving = ? WHERE ID = ? ',
                values: [naam, beschrijving, categorieID],
                timeout: 3000
            }
            db.query(query, function (err, row, field) {
                if (err) {
                    res.status(500).json(new ApiResponse(500, err)).end()
                    return
                } else {
                    
                    db.query('SELECT * FROM user WHERE ID = ?',[id.sub],function(err,row,field){
                        let responseObject = {
                            "ID": categorieID,
                            "naam": naam,
                            "beschrijving": beschrijving,
                            "beheerder": row[0].Voornaam,
                            "email": row[0].Email
                        }
                        res.status(200).json(new ApiResponse(200, responseObject)).end()

                    })
                    
                }
            })
        }
    })


}

module.exports = {
    getAllCategories,
    makeCategorie,
    getCategorieByID,
    editCategorie
}