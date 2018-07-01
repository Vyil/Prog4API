// Require
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const ApiResponse = require('./model/ApiResponse')

const PORT = process.env.PORT || 3000;

//Route files
let authentication_routes = require('./routes/authentication_routes')
let categorie_routes = require('./routes/categorie_routes')
let spullen_routes = require('./routes/spullen_routes')
let deler_routes = require('./routes/delers_routes')

// Use Body Parser to get properties from body in posts
app.use(bodyParser.json())

// Hello World, Used for pinging the server
app.get('/', function (req, res, next) {
    res.send('Hello World')
})

//Routes
app.use('/api', authentication_routes)
app.use('/api/categorie', categorie_routes)
app.use('/api/categorie',spullen_routes)
app.use('/api/categorie', deler_routes)

//Catch 404's 
app.use('*', function (req, res) {
    res.status('404').json(new ApiResponse(404, "Page not found")).end()
})

app.listen(PORT, () => {
	console.log('Listening on port: ' + PORT);
})