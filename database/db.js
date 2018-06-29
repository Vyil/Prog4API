let mysql = require('mysql')

let connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: '', //process.env.DB_PASSWORD,
    database: 'spullendelen'
})

connection.connect(function (error) {
    if (error) {
        console.log(error);
        return;
    } else {
        console.log("Connected to mysqlserver")
    }
})
module.exports = connection;