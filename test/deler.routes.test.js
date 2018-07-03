const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');

chai.should();
chai.use(chaiHttp);

let tokenWithIDOne = "Bearer " + "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1MzEzMjM0MTAsImlhdCI6MTUzMDQ1OTQxMCwic3ViIjoxfQ.N5IVAegPdEDACFKouAHXNiA8p9fm_iR5hkNDEY0pkh8"
let tokenWithIDTwo = "Bearer " + "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1MzEzMjMzNTIsImlhdCI6MTUzMDQ1OTM1Miwic3ViIjoyfQ.xEEdrhmKMlHx-vkf_RjBMtO9lVcELveuG_tPoqwJktE"

describe('getAllDelers', function() {
    this.timeout(10000);

    it('should throw an error when no token is supplied', (done) => {
        chai.request(server)
            .get('/api/categorie/2/spullen/3/delers')
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
            .get('/api/categorie/2/spullen/3/delers')
            .send({
               
            })
            .set('Authorization', tokenWithIDOne)
            .end((error, response) => {
            response.should.have.status(200);
            response.should.be.a('object');

            done()
        });
    });

    it('should throw an error when no valid id is supplied', (done) => {
        chai.request(server)
            .get('/api/categorie/2/spullen/5/delers')
            .send({
                
              })
            .end((error, response) => {
            response.should.have.status(404);
            response.should.be.a('object');

            const body = response.body;
            body.should.have.property('status').equals(404);
            body.should.have.property('message');
            done()
        });
    });
});

describe('meldAan', function() {
    this.timeout(10000);

    it('should throw an error when no token is supplied', (done) => {
        chai.request(server)
            .post('/api/categorie/2/spullen/3/delers')
            .send({
                "voornaam": "appie",
                "achternaam": "heijn",
                "email": "heijn@avans.nl"
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

    it('should throw an error when aanmelder already exists', (done) => {
        setTimeout(done, 10000);
        chai.request(server)
            .post('/api/categorie/2/spullen')
            .send({
                "voornaam": "appie",
                "achternaam": "heijn",
                "email": "heijn@avans.nl"
            })
            .set('Authorization', tokenWithIDOne)
            .end((error, response) => {
            response.should.have.status(409);
            response.should.be.a('object');

            const body = response.body;
            body.should.have.property('status').equals(409);
            body.should.have.property('message');
            done();
        });
    });

    it('should give status 200 on succesfull add aanmelder', (done) => {
        setTimeout(done, 10000);
        chai.request(server)
            .post('/api/categorie/2/spullen')
            .send({
                "voornaam": "appie",
                "achternaam": "heijn",
                "email": "heijn@avans.nl"
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

    it('should throw an error when no valid id is supplied', (done) => {
        chai.request(server)
            .post('/api/categorie/2/spullen/5/delers')
            .send({
                
              })
            .end((error, response) => {
            response.should.have.status(404);
            response.should.be.a('object');

            const body = response.body;
            body.should.have.property('status').equals(404);
            body.should.have.property('message');
            done()
        });
    });

});
