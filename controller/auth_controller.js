const auth = require('../authentication/authentication')
const db = require('../database/db')
const ApiResponse = require('../model/ApiResponse')
const uLog = require('../model/user_login')
const uRegister = require('../model/user_register')

function login(req, res) {

    let email = req.body.email
    let password = req.body.password

    //Check if parameters exist
    if (!email || !password) {
        res.status(412).json(new ApiResponse(412, 'Een of meer properties in de request body ontbreken of zijn foutief')).end()
        return
    }

    try {
        var user = new uLog(req.body.email, req.body.password)

        //Check if user exists
        db.query('SELECT * FROM user WHERE Email = ?', [user.email], function (error, rows, fields) {
            if (!rows[0]) {
                res.status(401).json(new ApiResponse(401, 'User bestaat niet')).end()
                return
                //If exists we go on
            } else {
                db.query('SELECT Email, Password FROM user WHERE Email = ?', [user.email], function (errors, rows, fields) {
                    //Handle error
                    if (error) {
                        res.status(500).json(new ApiResponse(500, error)).end()
                        return
                    } else {
                        if (user.email == rows[0].Email && user.password == rows[0].Password) {
                            //If credentials match, create token with ID
                            let token = auth.encodeToken(rows[0].ID)
                            let resultObject = {
                                "token": token,
                                "email": user.email
                            }
                            res.status(200).json(resultObject).end()
                        } else {
                            res.status(401).json(new ApiResponse(401, "Niet geautoriseerd (geen valid token)")).end()
                        }
                    }
                })
            }
        })
    } catch (ex) {
        res.status(412).json(412, new ApiResponse(412,ex.toString()))
        return
    }
}

function register(req, res) {

    let firstname = req.body.firstname
    let lastname = req.body.lastname
    let email = req.body.email
    let password = req.body.password

    if (!firstname || firstname == '' || !lastname || lastname == '' || !email || email == '' || !password || password == '') {
        res.status(412).json(new ApiResponse(412, 'Een of meer properties in de request body ontbreken of zijn foutief')).end()
        return
    }

    try{
        var user = new uRegister(req.body.firstname, req.body.lastname, req.body.email, req.body.password)

        let queryUser = {
            sql: 'INSERT INTO user (Voornaam, Achternaam, Email, Password) VALUES (?,?,?,?)',
            values: [user.firstname, user.lastname, user.email, user.password],
            timeout: 3000
        }
    
        db.query('SELECT Email FROM user WHERE Email = ?', [user.email], function (error, rows, fields) {
            if (rows.length > 0) {
                res.status(406).json(new ApiResponse(406, 'Email bestaat al')).end()
                return
            } else {
                db.query(queryUser, function (error, result) {
                    if (error) {
                        res.status(500).json(new ApiResponse(500, error)).end()
                        return
                    } else {
                        db.query('SELECT * FROM user WHERE Email = ?', [user.email], function (error, row, fields) {
                            let token = auth.encodeToken(row[0].ID)
                            let resultObject = {
                                "token": token,
                                "email": user.email
                            }
                            res.status(200).json(resultObject).end()
                        })
                    }
                })
            }
        })
    }catch(ex){
        res.status(412).json(412, new ApiResponse(412,ex.toString()))
        return
    }
}

module.exports = {
    login,
    register
}