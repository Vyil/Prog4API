const assert = require('assert')
const ApiResponse = require('../model/ApiResponse')

class categorie {
    constructor(naam, beschrijving) {

        this.error = true

        try {
            assert(typeof (naam) === 'string', 'naam must be a string')
            assert(typeof (beschrijving) === 'string', 'beschrijving must be a string.')
            assert(naam !== '', 'Name is missing')
            assert(beschrijving !== '', 'Beschrijving is missing')
        } catch (e) {
            throw (e)
            return
        }

        this.naam = naam
        this.beschrijving = beschrijving
        this.error = false
    }
}

module.exports = categorie