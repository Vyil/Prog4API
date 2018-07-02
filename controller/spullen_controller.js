const auth = require('../authentication/authentication')
const db = require('../database/db')
const ApiResponse = require('../model/ApiResponse')
const spullenModel = require('../model/spullen')

function getAllSpullen(req, res) {
    let token = req.get('Authorization')

    if (!token) {
        res.status(401).json(new ApiResponse(401, 'Niet geautoriseerd (geen valid token)')).end()
        return
    }

    let categorieID = req.params.id || ''

    db.query('SELECT * FROM spullen WHERE categorieID = ?', [categorieID], function (error, rows, fields) {
        if (!rows[0]) {
            res.status(404).json(new ApiResponse(404, 'Niet gevonden (categorieId bestaat niet)')).end()
            return
        } else {
            res.status(200).json(rows).end()
        }
    })
}

function addSpullen(req, res) {
    let token = req.get('Authorization')

    if (!token) {
        res.status(401).json(new ApiResponse(401, 'Niet geautoriseerd (geen valid token)')).end()
        return
    }
    let removeBearer = token.substr(7)
    let id = auth.decodeToken(removeBearer)

    let categorieID = req.params.id || ''

    if (!req.body.naam || !req.body.beschrijving || !req.body.merk || !req.body.soort || !req.body.bouwjaar) {
        res.status(412).json(new ApiResponse(412, 'Een of meer properties in de request body ontbreken of zijn foutief')).end()
        return
    }
    try {
        var spul = new spullenModel(req.body.naam, req.body.beschrijving, req.body.merk, req.body.soort, req.body.bouwjaar)

        db.query('SELECT * FROM categorie WHERE ID = ?', [categorieID], function (error, rows, fields) {
            if (!rows[0]) {
                res.status(404).json(new ApiResponse(404, 'Niet gevonden (categorieId bestaat niet)')).end()
                return
            } else {
                let query = {
                    sql: 'INSERT INTO spullen (Naam, Beschrijving, Merk, Soort, Bouwjaar, UserID, categorieID) VALUES (?,?,?,?,?,?,?)',
                    values: [spul.naam, spul.beschrijving, spul.merk, spul.soort, spul.bouwjaar, id.sub, categorieID],
                    timeout: 3000
                }
                db.query(query, function (error, rows, fields) {
                    if (error) {
                        res.status(500).json(new ApiResponse(500, error)).end()
                    } else {
                        let returnObject = {
                            "naam": spul.naam,
                            "beschrijving": spul.beschrijving,
                            "merk": spul.merk,
                            "soort": spul.soort,
                            "bouwjaar": spul.bouwjaar
                        }
                        res.status(200).json(new ApiResponse(200, returnObject)).end()
                    }
                })
            }
        })
    } catch (ex) {
        res.status(412).json(412, new ApiResponse(412, ex.toString()))
        return
    }
}

function getSpulByID(req, res) {
    let token = req.get('Authorization')
    if (!token) {
        res.status(401).json(new ApiResponse(401, 'Niet geautoriseerd (geen valid token)')).end()
        return
    }

    let categorieID = req.params.id || ''
    let spulID = req.params.spullid || ''

    db.query('SELECT * FROM categorie WHERE ID = ?', [categorieID], function (error, rows, fields) {
        if (!rows[0]) {
            res.status(404).json(new ApiResponse(404, 'Niet gevonden (categorieId bestaat niet)')).end()
            return
        } else {
            db.query('SELECT * FROM spullen WHERE ID = ?', [spulID], function (err, row, field) {
                if (!row[0]) {
                    res.status(404).json(new ApiResponse(404, 'Niet gevonden (spullenID bestaat niet)')).end()
                    return
                } else {
                    res.status(200).json(new ApiResponse(200, row)).end()
                }
            })
        }
    })

}

function editSpul(req, res) {
    let token = req.get('Authorization')
    if (!token) {
        res.status(401).json(new ApiResponse(401, 'Niet geautoriseerd (geen valid token)')).end()
        return
    }

    let removeBearer = token.substr(7)
    let id = auth.decodeToken(removeBearer)

    let categorieID = req.params.id || ''
    let spulID = req.params.spullid || ''

    if (!req.body.naam ||  !req.body.beschrijving ||  !req.body.merk ||!req.body.soort ||  !req.body.bouwjaar ) {
        res.status(412).json(new ApiResponse(412, 'Een of meer properties in de request body ontbreken of zijn foutief')).end()
        return
    }

    try{
        var spul = new spullenModel(req.body.naam, req.body.beschrijving, req.body.merk, req.body.soort, req.body.bouwjaar)

        db.query('SELECT * FROM categorie WHERE ID =?', [categorieID], function (error, rows, fields) {
            if (!rows[0]) {
                res.status(404).json(new ApiResponse(404, 'Niet gevonden (categorieId bestaat niet)')).end()
                return
            } else {
                db.query('SELECT * FROM spullen WHERE ID = ?', [spulID], function (err, row, field) {
                    if (!row[0]) {
                        res.status(404).json(new ApiResponse(404, 'Niet gevonden (spullenID bestaat niet)')).end()
                        return
                    } else {
                        if (row[0].UserID != id.sub) {
                            res.status(409).json(new ApiResponse(409, 'Conflict (Gebruiker mag deze data niet wijzigen)')).end()
                            return
                        } else {
                            let query = {
                                sql: 'UPDATE spullen SET Naam = ?, Beschrijving = ?, Merk = ?, Soort = ?, Bouwjaar = ? WHERE ID = ? ',
                                values: [spul.naam, spul.beschrijving, spul.merk, spul.soort, spul.bouwjaar, spulID],
                                timeout: 3000
                            }
                            db.query(query, function (error, rows, fields) {

                                if (err) {
                                    res.status(500).json(new ApiResponse(500, error)).end()
                                } else {
                                    let returnObject = {
                                        "ID": spulID,
                                        "naam": spul.naam,
                                        "beschrijving": spul.beschrijving,
                                        "merk": spul.merk,
                                        "soort": spul.soort,
                                        "bouwjaar": spul.bouwjaar
                                    }
                                    res.status(200).json(new ApiResponse(200, returnObject)).end()
                                }
                            })
                        }
                    }
                })
            }
        })
    }catch(ex){
        res.status(412).json(412, new ApiResponse(412, ex.toString()))
        return
    }
}

function deleteSpul(req, res) {
    let token = req.get('Authorization')

    if (!token) {
        res.status(401).json(new ApiResponse(401, 'Niet geautoriseerd (geen valid token)')).end()
        return
    }

    let removeBearer = token.substr(7)
    let id = auth.decodeToken(removeBearer)

    let categorieID = req.params.id || ''
    let spulID = req.params.spullid || ''

    db.query('SELECT * FROM categorie WHERE ID =?', [categorieID], function (error, rows, fields) {
        if (!rows[0]) {
            res.status(404).json(new ApiResponse(404, 'Niet gevonden (categorieId bestaat niet)')).end()
            return
        } else {
            db.query('SELECT * FROM spullen WHERE ID = ?', [spulID], function (err, row, field) {
                if (!row[0]) {
                    res.status(404).json(new ApiResponse(404, 'Niet gevonden (spullenID bestaat niet)')).end()
                    return
                } else {
                    if (row[0].UserID != id.sub) {
                        res.status(409).json(new ApiResponse(409, 'Conflict (Gebruiker mag deze data niet wijzigen)')).end()
                        return
                    } else {
                        db.query('DELETE FROM spullen WHERE ID = ?', [spulID], function (err, row, field) {
                            if (err) {
                                res.status(500).json(new ApiResponse(500, err)).end()
                            } else {
                                res.status(200).json(new ApiResponse(200, 'Verwijderd spul met ID: ' + spulID)).end()
                            }
                        })
                    }
                }

            })
        }
    })
}

module.exports = {
    getAllSpullen,
    addSpullen,
    getSpulByID,
    editSpul,
    deleteSpul
}