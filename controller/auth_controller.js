const auth = require('../authentication/authentication')
const db = require('../database/db')
const ApiResponse = require('../model/ApiResponse')

function login(req,res){
     
    let email = req.body.email;
    let password = req.body.password;

    //Check if parameters exist
    if(!email || email ==''|| !password || password ==''){
        res.status(412).json(new ApiResponse(412, 'Missing parameters')).end()
        return
    }

    console.log(email, password)
    //Check if user exists
    db.query('SELECT * FROM user WHERE Email = ?',[email], function(error,rows,fields){
        if(!rows[0]){
            res.status(401).json(new ApiResponse(401, 'Username does not exist')).end()
            return
            //If exists we go on
        } else {
            db.query('SELECT Email, Password FROM user WHERE Email = ?',[email], function(errors,rows,fields){
                //Handle error
                if(error){
                    res.status(500).json(new ApiResponse(500,error)).end()
                    return
                } else {
                    if(email == rows[0].Email && password == rows[0].Password){
                        //If credentials match, create token with ID
                        let token = auth.encodeToken(rows[0].ID)
                        res.status(200).json(new ApiResponse(200,token)).end()
                    } else {
                        res.status(401).json(new ApiResponse(401, "No valid credentials")).end()
                    }
                }
            })
        }
    })
}

module.exports = {
    login
}