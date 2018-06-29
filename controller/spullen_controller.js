const auth = require('../authentication/authentication')
const db = require('../database/db')
const ApiResponse = require('../model/ApiResponse')

function getAllSpullen(req, res) {
    let token = req.get('Authorization')

    let categorieID = req.params.id || ''

    if (!token) {
        res.status(401).json(new ApiResponse(401, 'Niet geautoriseerd (geen valid token)')).end()
        return
    }

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
    let removeBearer = token.substr(7)
    let id = auth.decodeToken(removeBearer)

    let categorieID = req.params.id || ''
    let naam = req.body.naam || ''
    let beschrijving = req.body.beschrijving || ''
    let merk = req.body.merk || ''
    let soort = req.body.soort || ''
    let bouwjaar = req.body.bouwjaar || null

    if (!token) {
        res.status(401).json(new ApiResponse(401, 'Niet geautoriseerd (geen valid token)')).end()
        return
    }
    if (!categorieID || categorieID == '' || !naam || naam == '' || !beschrijving || beschrijving == '' ||
        !merk || merk == '' || !soort || soort == '' || !bouwjaar || bouwjaar == '') {
        res.status(412).json(new ApiResponse(412, 'Een of meer properties in de request body ontbreken of zijn foutief')).end()
        return
    }

    db.query('SELECT * FROM categorie WHERE ID = ?', [categorieID], function (error, rows, fields) {
        if (!rows[0]) {
            res.status(404).json(new ApiResponse(404, 'Niet gevonden (categorieId bestaat niet)')).end()
            return
        } else {
            let query = {
                sql: 'INSERT INTO spullen (Naam, Beschrijving, Merk, Soort, Bouwjaar, UserID, categorieID) VALUES (?,?,?,?,?,?,?)',
                values: [naam, beschrijving, merk, soort, bouwjaar, id.sub, categorieID],
                timeout: 3000
            }
            db.query(query, function (error, rows, fields) {
                if (error) {
                    res.status(500).json(new ApiResponse(500, error)).end()
                } else {
                    let returnObject = {
                        "naam": naam,
                        "beschrijving": beschrijving,
                        "merk": merk,
                        "soort": soort,
                        "bouwjaar": bouwjaar
                    }
                    res.status(200).json(new ApiResponse(200, returnObject)).end()
                }
            })
        }
    })

}

function getSpulByID(req, res) {
    let token = req.get('Authorization')

    let categorieID = req.params.id || ''
    let spulID = req.params.spullid || ''

    if (!token) {
        res.status(401).json(new ApiResponse(401, 'Niet geautoriseerd (geen valid token)')).end()
        return
    }


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
    let removeBearer = token.substr(7)
    let id = auth.decodeToken(removeBearer)

    let naam = req.body.naam || ''
    let beschrijving = req.body.beschrijving || ''
    let merk = req.body.merk || ''
    let soort = req.body.soort || ''
    let bouwjaar = req.body.bouwjaar || ''
    let categorieID = req.params.id || ''
    let spulID = req.params.spullid || ''

    if (!token) {
        res.status(401).json(new ApiResponse(401, 'Niet geautoriseerd (geen valid token)')).end()
        return
    }
    if (!naam || naam == '' || !beschrijving || beschrijving == '' || !merk || merk == '' ||
        !soort || soort == '' || !bouwjaar || bouwjaar == '' || !categorieID || categorieID == '' || !spulID || spulID == '') {
        res.status(412).json(new ApiResponse(412, 'Een of meer properties in de request body ontbreken of zijn foutief')).end()
        return
    }

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
                    if (!row[0].UserID == id.sub) {
                        res.status(409).json(new ApiResponse(409, 'Conflict (Gebruiker mag deze data niet wijzigen)')).end()
                        return
                    } else {
                        let query = {
                            sql: 'UPDATE spullen SET Naam = ?, Beschrijving = ?, Merk = ?, Soort = ?, Bouwjaar = ? WHERE ID = ? ',
                            values: [naam, beschrijving, merk, soort, bouwjaar, spulID],
                            timeout: 3000
                        }
                        db.query(query, function (error, rows, fields) {
                            if (err) {
                                res.status(500).json(new ApiResponse(500, error)).end()
                            } else {
                                let returnObject = {
                                    "ID": spulID,
                                    "naam": naam,
                                    "beschrijving": beschrijving,
                                    "merk": merk,
                                    "soort": soort,
                                    "bouwjaar": bouwjaar
                                }
                                res.status(200).json(new ApiResponse(200, returnObject)).end()
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
    editSpul
}