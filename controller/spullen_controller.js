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
    if(!categorieID || categorieID==''|| !naam || naam==''|| !beschrijving || beschrijving ==''
        || !merk || merk == ''|| !soort|| soort==''|| !bouwjaar || bouwjaar==''){
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

module.exports = {
    getAllSpullen,
    addSpullen
}