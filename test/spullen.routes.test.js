const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');

chai.should();
chai.use(chaiHttp);

let tokenWithIDOne = "Bearer " + "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1MzEzMjM0MTAsImlhdCI6MTUzMDQ1OTQxMCwic3ViIjoxfQ.N5IVAegPdEDACFKouAHXNiA8p9fm_iR5hkNDEY0pkh8"
let tokenWithIDTwo = "Bearer " + "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1MzEzMjMzNTIsImlhdCI6MTUzMDQ1OTM1Miwic3ViIjoyfQ.xEEdrhmKMlHx-vkf_RjBMtO9lVcELveuG_tPoqwJktE"

describe('getAllSpullen', function() {
    this.timeout(10000);

    it('should throw an error when no token is supplied', (done) => {
        chai.request(server)
            .get('/api/categorie/2/spullen')
            .send({
                
            })
            .end((error, response) => {
            response.should.have.status(401);
            response.should.be.a('object');

            const body = response.body;
            body.should.have.property('status').equals(401);
            body.should.have.property('message');
            done()
        });
    });

    it('should return object on succesfull get', (done) => {
        setTimeout(done, 10000);
        chai.request(server)
            .get('/api/categorie/2/spullen')
            .send({
               
            })
            .set('Authorization', tokenWithIDOne)
            .end((error, response) => {
            response.should.have.status(200);
            response.should.be.a('object');

            done()
        });
    });
});

describe('addSpullen', function() {
    this.timeout(10000);

    it('should throw an error when no token is supplied', (done) => {
        chai.request(server)
            .post('/api/categorie/2/spullen')
            .send({
                "naam": "testuser",
                "beschrijving": "testbeschrijving",
                "merk": "testmerk",
                "soort": "testsoort",
                "bouwjaar": 2018
            })
            .end((error, response) => {
            response.should.have.status(401);
            response.should.be.a('object');

            const body = response.body;
            body.should.have.property('status').equals(401);
            body.should.have.property('message');
            done()
        });
    });

    it('should throw an error when categorie already exists', (done) => {
        setTimeout(done, 10000);
        chai.request(server)
            .post('/api/categorie/2/spullen')
            .send({
                "naam": "testuser",
                "beschrijving": "testbeschrijving",
                "merk": "testmerk",
                "soort": "testsoort",
                "bouwjaar": 2018
            })
            .set('Authorization', tokenWithIDOne)
            .end((error, response) => {
            response.should.have.status(412);
            response.should.be.a('object');

            const body = response.body;
            body.should.have.property('status').equals(412);
            body.should.have.property('message');
            done();
        });
    });

    it('should give status 200 on succesfull add spullen', (done) => {
        setTimeout(done, 10000);
        chai.request(server)
            .post('/api/categorie/2/spullen')
            .send({
                "naam": "testuser",
                "beschrijving": "testbeschrijving",
                "merk": "testmerk",
                "soort": "testsoort",
                "bouwjaar": 2018
            })
            .set('Authorization', tokenWithIDOne)
            .end((error, response) => {
            response.should.have.status(200);
            response.should.be.a('object');

            const body = response.body;
            body.should.have.property('beheerder');
            done();
        });
    });

    it('should give error and status 412 on wrong parameter', (done) => {
        setTimeout(done, 10000);
        chai.request(server)
            .post('/api/categorie/2/spullen')
            .send({
                "naam": "testuser",
                "beschrijving": "testbeschrijving",
                "merk": "testmerk",
                "soort": "testsoort",
                "bouwjaar": 2018
            })
            .set('Authorization', tokenWithIDOne)
            .end((error, response) => {
            response.should.have.status(412);
            response.should.be.a('object');

            const body = response.body;
            body.should.have.property('message');
            done();
        });
    });
});