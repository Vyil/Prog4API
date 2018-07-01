const auth = require('../authentication/authentication')
const db = require('../database/db')
const ApiResponse = require('../model/ApiResponse')

function getAllDelers(req, res){
    let token = req.get('Authorization')

    let categorieID = req.params.id || ''
    let spullenID= req.params.spullid || ''

    if (!token) {
        res.status(401).json(new ApiResponse(401, 'Niet geautoriseerd (geen valid token)')).end()
        return
    }


    db.query('SELECT * FROM delers WHERE categorieID= ? AND spullenID =? ', [categorieID, spullenID], function (error, rows, fields) {
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

    let categorieID = req.params.id || ''
    let spullenID= req.params.spullid || ''

    if (!token) {
        res.status(401).json(new ApiResponse(401, 'Niet geautoriseerd (geen valid token)')).end()
        return
    }

    db.query('SELECT * FROM delers WHERE categorieID= ? AND spullenID =? ', [categorieID, spullenID], function (error, rows, fields) {
        if (error){
            res.status(500).json(new ApiResponse(500, error)).end()
            return
        }
        if (!rows[0]) {
            res.status(404).json(new ApiResponse(404, 'Niet gevonden (categorieId of spullenId bestaat niet)')).end()
            return
        } else {

            db.query('SELECT UserID FROM delers WHERE UserID = ?',[id.sub], function(err,row,field){
                if(!row[0]){
                    let insertQuery = {
                        sql: 'INSERT INTO delers (UserID, categorieID, spullenID) VALUES (?,?,?) ',
                        values: [id.sub, categorieID, spullenID],
                        timeout: 3000
                    }
        
                    db.query(insertQuery,function(err,row,field){
                        if(err){
                            res.status(500).json(new ApiResponse(500,err)).end()
                            return
                        } else {
                            db.query('SELECT Voornaam, Achternaam, Email FROM user WHERE ID = ?', [id.sub], function(error,rows,fields){
                                res.status(200).json(rows).end()
                            })
                        }
                    })
                } else {
                    res.status(409).json(new ApiResponse(409, 'Conflict (Gebruiker is al aangemeld)')).end()
                    return
                }
            })
        } 
    })




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

module.exports = {
    getAllDelers,
    meldAan,
    deleteDeler
}