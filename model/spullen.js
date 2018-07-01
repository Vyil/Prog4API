const assert = require('assert')
const ApiResponse = require('../model/ApiResponse')

class spullen {
    constructor(naam, beschrijving, merk, soort, bouwjaar) {

        try {
            assert(typeof (naam) === 'string', 'naam must be a string')
            assert(typeof (beschrijving) === 'string', 'beschrijving must be a string.')
            assert(typeof (merk) === 'string', 'merk must be a string.')
            assert(typeof (soort) === 'string', 'soort must be a string.')
            assert(typeof (bouwjaar) === 'number', 'bouwjaar must be a number.')
            assert(naam !== '', 'Name is missing')
            assert(beschrijving !== '', 'Beschrijving is missing')
            assert(merk !== '', 'Merk is missing')
            assert(soort !== '', 'Soort is missing')
            assert(bouwjaar !== '', 'bouwjaar is missing')
        } catch (e) {
            throw (e)
            return
        }

        this.naam = naam
        this.beschrijving = beschrijving
        this.merk = merk
        this.soort = soort
        this.bouwjaar = bouwjaar
    }
}

module.exports = spullen