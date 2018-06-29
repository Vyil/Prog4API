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

    let naam = req.body.naam
    let beschrijving = req.body.beschrijving
    let token = req.get('Authorization')
    let removeBearer = token.substr(7)
    let id = auth.decodeToken(removeBearer)

    if (!token) {
        res.status(401).json(new ApiResponse(401, 'Niet geautoriseerd (geen valid token)')).end()
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

    module.exports = {
        getAllCategories,
        makeCategorie
    }