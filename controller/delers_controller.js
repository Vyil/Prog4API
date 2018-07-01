const auth = require('../authentication/authentication')
const db = require('../database/db')
const ApiResponse = require('../model/ApiResponse')

function getAllDelers(req, res){
    let token = req.get('Authorization')

    let spullenID= req.params.id || ''

    if (!token) {
        res.status(401).json(new ApiResponse(401, 'Niet geautoriseerd (geen valid token)')).end()
        return
    }


    db.query('SELECT * FROM delers WHERE UserID= ? AND categorieID= ? AND spullenID =? ', [spullenID], function (error, rows, fields) {
        if (!rows[0]) {
            res.status(404).json(new ApiResponse(404, 'Niet gevonden (categorieId of spullenId bestaat niet)')).end()
            return
        } else {
            res.status(200).json(rows).end()
        }
    })

}

function meldAan (req, res){
    let token = req.get('Authorization')
    let removeBearer = token.substr(7)
    let id = auth.decodeToken(removeBearer)

    let voornaam = req.body.voornaam || ''
    let achternaam = req.body.achternaam || ''
    let email = req.body.email || ''

    if (!token) {
        res.status(401).json(new ApiResponse(401, 'Niet geautoriseerd (geen valid token)')).end()
        return
    }

}

function deleteDeler(req, res){
    let token = req.get('Authorization')
    let removeBearer = token.substr(7)
    let id = auth.decodeToken(removeBearer)

    let UserID = req.params.UserID|| ''
    let categorieID = req.params.id || ''
    let spulID = req.params.spullid || ''


    if (!token) {
        res.status(401).json(new ApiResponse(401, 'Niet geautoriseerd (geen valid token)')).end()
        return
    }

    auth.decodeToken(token, (err, payload) => {
        const query = {
            sql: 'SELECT * FROM delers WHERE UserID= ? AND categorieID= ? AND spullenID =? ' ,
            values: [UserID,categorieID,spulID],
        };
    
        db.query( query, (error, rows, fields) => {
                if (rows.length>0) {
                    const query = { 
                        sql: 'Delete FROM delers WHERE UserID= ? AND categorieID= ? AND spullenID =? ',
                        values: [UserID,categorieID,spulID],
                    };
                
                    db.query( query, (error, rows, fields) => {
                            if (error) {
                                res.status(404).send("Niet gevonden (categorieId of spullenId bestaat niet)")
                            } else {
                                res.status(200).json(rows)
                            }
                        });
                } else {
                    res.status(409).send({
                        "Message": "Conflict (Gebruiker mag deze data niet verwijderen)"
                    });
                }
            });


    });
}