const config = require('../config/config');
const moment = require('moment');
const jwt = require('jwt-simple');

// Encode (from username to token)
function encodeToken(id) {
    const payload = {
        exp: moment().add(10, 'days').unix(),
        iat: moment().unix(),
        sub: id
    };

    return jwt.encode(payload, config.key);
}

// Decode (from token to username)
function decodeToken(token, callback) {
    try {
        const payload = jwt.decode(token, config.key);
        // Check if the token has expired
        const now = moment().unix();
        if(now > payload.exp) {
            console.log('Token has expired', null);
        } 
        
        return payload
        
    } catch(error) {
        console.log(error, null);
    }
}



module.exports = { encodeToken, decodeToken };