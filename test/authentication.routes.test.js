const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');

chai.should();
chai.use(chaiHttp);

// Set this token after succesful registration
let validToken;

describe('Registration', function() {
    this.timeout(10000);
    it('should return a token when providing valid information', (done) => {
        setTimeout(done, 10000);
        chai.request(server)
            .post('/api/register')
            .send({
                email: "aron@h-cornet.nl",
                firstname: "Aron",
                lastname: "Cornet",
                password: "test123"
            }).end((error, response) => {
            response.should.have.status(200);
            response.should.be.a('object');

            const body = response.body;
            body.should.have.property('token');
            body.should.have.property('email').equals('aron@h-cornet.nl');

            // Tip: deze test levert een token op. Dat token gebruik je in
            // andere testcases voor beveiligde routes door het hier te exporteren
            // en in andere testcases te importeren via require.
            validToken = body.token;
            module.exports = {
                token: validToken
            };
            done()
        });
    });

    it('should return an error on GET request', (done) => {
        setTimeout(done, 10000);
        chai.request(server)
            .get('/api/nonexistingendpoint')
            .send({

            }).end((error, response) => {
            response.should.have.status(401);
            response.should.be.a('object');

            const body = response.body;
            body.should.have.property('status').equals(401);
            body.should.have.property('message').equals('No token supplied');

            done();
        });
    });

    it('should throw an error when the user already exists', (done) => {
        setTimeout(done, 10000);
        chai.request(server)
            .post('/api/register')
            .send({
                email: "aron@h-cornet.nl",
                firstname: "Aron",
                lastname: "Cornet",
                password: "test123"
            }).end((error, response) => {
                response.should.have.status(406);
                response.should.be.a('object');

                const body = response.body;
                body.should.have.property('status').equals(406);
                body.should.have.property('message').equals('Een gebruiker met dit email adres bestaat al.');
                done();
        });
    });

    it('should throw an error when no firstname is provided', (done) => {
        setTimeout(done, 10000);
        chai.request(server)
            .post('/api/register')
            .send({
                email: "aron@h-cornet.nl",
                lastname: "Cornet",
                password: "test123"
            }).end((error, response) => {
            response.should.have.status(412);
            response.should.be.a('object');

            const body = response.body;
            body.should.have.property('status').equals(412);
            body.should.have.property('message').equals('Een of meer properties in de request body ontbreken of zijn foutief');
            done();
        });
    });

    it('should throw an error when firstname is shorter than 2 chars', (done) => {
        setTimeout(done, 10000);
        chai.request(server)
            .post('/api/register')
            .send({
                email: "aron@h-cornet.nl",
                firstname: "A",
                lastname: "Cornet",
                password: "test123"
            }).end((error, response) => {
            response.should.have.status(412);
            response.should.be.a('object');

            const body = response.body;
            body.should.have.property('status').equals(412);
            body.should.have.property('message').equals('Een of meer properties in de request body ontbreken of zijn foutief');
            done();
        });
    });

    it('should throw an error when no lastname is provided', (done) => {
        setTimeout(done, 10000);
        chai.request(server)
            .post('/api/register')
            .send({
                email: "aron@h-cornet.nl",
                firstname: "Aron",
                password: "test123"
            }).end((error, response) => {
            response.should.have.status(412);
            response.should.be.a('object');

            const body = response.body;
            body.should.have.property('status').equals(412);
            body.should.have.property('message').equals('Een of meer properties in de request body ontbreken of zijn foutief');
            done();
        });
    });

    it('should throw an error when lastname is shorter than 2 chars', (done) => {
        setTimeout(done, 10000);
        chai.request(server)
            .post('/api/register')
            .send({
                email: "aron@h-cornet.nl",
                firstname: "Aron",
                lastname: "C",
                password: "test123"
            }).end((error, response) => {
            response.should.have.status(412);
            response.should.be.a('object');

            const body = response.body;
            body.should.have.property('status').equals(412);
            body.should.have.property('message').equals('Een of meer properties in de request body ontbreken of zijn foutief');
            done();
        });
    });

    it('should throw an error when email is invalid', (done) => {
        setTimeout(done, 10000);
        chai.request(server)
            .post('/api/register')
            .send({
                email: "aronh-cornet.nl",
                firstname: "Aron",
                lastname: "Cornet",
                password: "test123"
            }).end((error, response) => {
            response.should.have.status(412);
            response.should.be.a('object');

            const body = response.body;
            body.should.have.property('status').equals(412);
            body.should.have.property('message').equals('Een of meer properties in de request body ontbreken of zijn foutief');
            done();
        });
    })
});

describe('Login', function() {
    this.timeout(10000);
    it('should return a token when providing valid information', (done) => {
        setTimeout(done, 10000);
        chai.request(server)
            .post('/api/login')
            .send({
                email: "aron@h-cornet.nl",
                password: "test123"
            }).end((error, response) => {
            response.should.have.status(200);
            response.should.be.a('object');

            const body = response.body;
            body.should.have.property('token');
            body.should.have.property('email').equals('aron@h-cornet.nl');
            done();
        });
    });

    it('should throw an error when email does not exist', (done) => {
        setTimeout(done, 10000);
        chai.request(server)
            .post('/api/login')
            .send({
                email: "non@existingemail.nl",
                password: "test123"
            }).end((error, response) => {
            response.should.have.status(401);
            response.should.be.a('object');

            const body = response.body;
            body.should.have.property('status').equals(401);
            body.should.have.property('message').equals('Niet geautoriseerd (geen valid token)');
            done();
        });
    });

    it('should throw an error when email exists but password is invalid', (done) => {
        setTimeout(done, 10000);
        chai.request(server)
            .post('/api/login')
            .send({
                email: "aron@h-cornet.nl",
                password: "notmatchingpassword"
            }).end((error, response) => {
            response.should.have.status(401);
            response.should.be.a('object');

            const body = response.body;
            body.should.have.property('status').equals(401);
            body.should.have.property('message').equals('Niet geautoriseerd (geen valid token)');
            done();
        });
    });

    it('should throw an error when using an invalid email', (done) => {
        setTimeout(done, 10000);
        chai.request(server)
            .post('/api/login')
            .send({
                email: "aronh-cornet.nl",
                password: "notmatchingpassword"
            }).end((error, response) => {
            response.should.have.status(412);
            response.should.be.a('object');

            const body = response.body;
            body.should.have.property('status').equals(412);
            body.should.have.property('message').equals('Een of meer properties in de request body ontbreken of zijn foutief');
            done();
        });
    })
});