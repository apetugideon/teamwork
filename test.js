var assert = require("assert");
let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../server");
let should = chai.should();
chai.use(chaiHttp);


//const dbconn = require("../dbconn");

let login_details = {
  "email": "test70@gmail.com",
  'password': 'test70'
}

let register_details = {
  "firstName": "toyin",
  "lastName": "toyin",
  "email": "toyin@gmail.com",
  "password": "toyin",
  "gender": "MALE",
  "jobRole": "ADMIN",
  "department": "ACCOUNT",
  "address": "123, Avenue"
};


describe('Create Account, Login and Check Token', () => {

  describe('/POST Create User', () => {
    it('it should Create Users, Login, and check token', (done) => {
      chai.request(server)
        .post('/api/v1/auth/create-user')
        .send(register_details)
        .end((err, res) => {
          console.log(res.body);
          //res.should.have.status(201);
          expect(res.statusCode).to.equal(201);
          done();
        })
    })
  });


  describe('/POST Sign IN', () => {
    it('It Should Sign A User and Check Token', (done) => {
      chai.request(server)
        .post('/api/v1/auth/signin')
        .send(login_details)
        .end((err, res) => {
          //console.log(res.body);
          //res.should.have.status(200);
          expect(res.body.status).to.equal("success");
          //res.body.data.should.have.property('token'); 
          done();
        })
    })
  });
});




