const auth = require('../authentication/authentication')
const db = require('../database/db')
const ApiResponse = require('../model/ApiResponse')
const categorieModel = require('../model/categorie')
const assert = require('assert')

function getAllCategories(req, res) {
    //Get token
    let token = req.get('Authorization')

    //Check if we have a token
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

    let token = req.get('Authorization')
    if (!token) {
        res.status(401).json(new ApiResponse(401, 'Niet geautoriseerd (geen valid token)')).end()
        return
    }

    //extract ID out of token
    let removeBearer = token.substr(7)
    let id = auth.decodeToken(removeBearer)
    var catg


    try {
        catg = new categorieModel(req.body.naam, req.body.beschrijving)

        let query = {
            sql: 'INSERT INTO categorie (Naam, Beschrijving, UserID) VALUES (?,?,?)',
            values: [catg.naam, catg.beschrijving, id.sub],
            timeout: 3000
        }       

        //Check if categorie exists
        db.query('SELECT * FROM categorie WHERE Naam = ?', [catg.naam], function (error, rows, fields) {
            if (rows.length > 0) {
                res.status(412).json(new ApiResponse(412, 'Categorie bestaat al')).end()
                return
            } else {
                //Insert query
                db.query(query, function (error, rows, fields) {
                    if (error) {
                        res.status(500).json(new ApiResponse(500, error)).end()
                    } else {
                        //Get results for returnObject
                        db.query('SELECT * FROM user WHERE ID = ?', [id.sub], function (err, row, field) {
                            if (error) {
                                res.status(500).json(new ApiResponse(500, error)).end()
                            } else {
                                Voornaam = row[0].Voornaam
                                Email = row[0].Email
                                db.query('SELECT * FROM categorie WHERE Naam = ?',[catg.naam], function(error,rows,fields){
                                    if(error){
                                        res.status(500).json(new ApiResponse(500, error)).end()
                                    }
                                    let returnObject = {
                                        "categorieID": rows[0].ID,
                                        "naam": catg.naam,
                                        "beschrijving": catg.beschrijving,
                                        "beheerder": Voornaam,
                                        "email": Email
                                    }
                                    res.status(200).json(returnObject).end()
                                })
                            }
                        })
                    }
                })
            }
        })
    } catch (ex) {
        res.status(412).json(412, new ApiResponse(412, ex.toString()))
        return
    }
}

function getCategorieByID(req, res) {
    let token = req.get('Authorization')

    if (!token) {
        res.status(401).json(new ApiResponse(401, 'Niet geautoriseerd (geen valid token)')).end()
        return
    }

    let removeBearer = token.substr(7)
    let id = auth.decodeToken(removeBearer)
    let urlID = req.params.id


    //Check if categorie exists
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

    if (!token) {
        res.status(401).json(new ApiResponse(401, 'Niet geautoriseerd (geen valid token)')).end()
        return
    }
    let removeBearer = token.substr(7)
    let id = auth.decodeToken(removeBearer)

    let categorieID = req.params.id || ''
    var catg
    if (!req.body.naam || !req.body.beschrijving) {
        res.status(412).json(new ApiResponse(412, 'Een of meer properties in de request body ontbreken of zijn foutief')).end()
        return
    }

    try {
        catg = new categorieModel(req.body.naam, req.body.beschrijving)
        db.query('SELECT * FROM categorie WHERE ID = ?', [categorieID], function (error, rows, fields) {
                if (!rows[0]) {
                    res.status(404).json(new ApiResponse(404, 'Niet gevonden (categorieId bestaat niet)')).end()
                    return
                } else {
                    if (rows[0].UserID != id.sub) {
                        res.status(409).json(new ApiResponse(409, 'Conflict (Gebruiker mag deze data niet wijzigen)')).end()
                        return
                    } else {
                        let query = {
                            sql: 'UPDATE categorie SET Naam = ?, Beschrijving = ? WHERE ID = ? ',
                            values: [catg.naam, catg.beschrijving, categorieID],
                            timeout: 3000
                        }
                        db.query(query, function (err, row, field) {
                            if (err) {
                                res.status(500).json(new ApiResponse(500, err)).end()
                                return
                            } else {

                                db.query('SELECT * FROM user WHERE ID = ?', [id.sub], function (err, row, field) {
                                    let responseObject = {
                                        "ID": categorieID,
                                        "naam": catg.naam,
                                        "beschrijving": catg.beschrijving,
                                        "beheerder": row[0].Voornaam,
                                        "email": row[0].Email
                                    }
                                    res.status(200).json(new ApiResponse(200, responseObject)).end()

                                })

                            }
                        })
                    }
                }
            })
        }
        catch (ex) {
            res.status(412).json(412, new ApiResponse(412, ex.toString()))
            return
        }
}

    function deleteCategorie(req, res) {
        let token = req.get('Authorization')
        if (!token) {
            res.status(401).json(new ApiResponse(401, 'Niet geautoriseerd (geen valid token)')).end()
            return
        }

        let removeBearer = token.substr(7)
        let id = auth.decodeToken(removeBearer)

        let categorieID = req.params.id || ''

        db.query('SELECT * FROM categorie WHERE ID = ?', [categorieID], function (error, rows, fields) {
            if (!rows[0]) {
                res.status(404).json(new ApiResponse(404, 'Niet gevonden (categorieId bestaat niet)')).end()
                return
            } else {
                if (rows[0].UserID != id.sub) {
                    res.status(409).json(new ApiResponse(409, 'Conflict (Gebruiker mag deze data niet verwijderen)')).end()
                    return
                } else {
                    db.query('DELETE FROM categorie WHERE ID = ?', [categorieID], function (err, row, field) {
                        if (err) {
                            res.status(500).json(new ApiResponse(500, err)).end()
                        } else {
                            res.status(200).json(new ApiResponse(200, 'Categorie verwijderd met ID: ' + categorieID)).end()
                        }
                    })
                }
            }
        })
    }

    module.exports = {
        getAllCategories,
        makeCategorie,
        getCategorieByID,
        editCategorie,
        deleteCategorie
    }