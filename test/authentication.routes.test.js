const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');

chai.should();
chai.use(chaiHttp);


describe('Registration', function() {
    this.timeout(10000);
    it('should return a token when providing valid information', (done) => {
        setTimeout(done, 10000);
        chai.request(server)
            .post('/api/register')
            .send({
                firstname: "Djim",
                lastname: "Oomes",
                password: "test123",
                email: "djim@djim.nl"
            }).end((error, response) => {
            response.should.have.status(200);
            response.should.be.a('object');

            const body = response.body;
            body.should.have.property('token');
            body.should.have.property('email');
            done()
        });
    });

    it('should throw an error when the user already exists', (done) => {
        setTimeout(done, 10000);
        chai.request(server)
            .post('/api/register')
            .send({
                firstname: "Djim",
                lastname: "oomes",
                password: "test123",
                email: "djim@djim.nl"
            }).end((error, response) => {
                response.should.have.status(406);
                response.should.be.a('object');

                const body = response.body;
                body.should.have.property('status').equals(406);
                body.should.have.property('message').equals('Email bestaat al');
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

    it('should throw an error when no lastname is provided', (done) => {
        setTimeout(done, 10000);
        chai.request(server)
            .post('/api/register')
            .send({
                firstname: "Djim",
                password: "test123",
                email: "djim@djim.nl"
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
                firstname: "Djim",
                lastname: "Oomes",
                password: "test123",
                email: "blabla"
            }).end((error, response) => {
            response.should.have.status(412);
            response.should.be.a('object');

            const body = response.body;
            body.should.have.property('status').equals(412);
            body.should.have.property('message');
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
                email: "jsmit@server.nl",
                password: "secret"
            }).end((error, response) => {
            response.should.have.status(200);
            response.should.be.a('object');

            const body = response.body;
            body.should.have.property('token');
            body.should.have.property('email');
            done();
        });
    });

    it('should throw an error when email does not exist', (done) => {
        setTimeout(done, 10000);
        chai.request(server)
            .post('/api/login')
            .send({
                email: "somerandomemail@email.com",
                password: "test123"
            }).end((error, response) => {
            response.should.have.status(401);
            response.should.be.a('object');

            const body = response.body;
            body.should.have.property('status').equals(401);
            body.should.have.property('message');
            done();
        });
    });

    it('should throw an error when email exists but password is invalid', (done) => {
        setTimeout(done, 10000);
        chai.request(server)
            .post('/api/login')
            .send({
                email: "jsmit@server.nl",
                password: "weirdpassword"
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
                email: "blablabla",
                password: "anotherbla"
            }).end((error, response) => {
            response.should.have.status(412);
            response.should.be.a('object');

            const body = response.body;
            body.should.have.property('status').equals(412);
            body.should.have.property('message');
            done();
        });
    })
});