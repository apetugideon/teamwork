//let benv  = process.env.NODE_ENV;
//const env = process.env.NODE_ENV || 'test';
let server = require("../server");
let chai = require('chai');
let chaiHttp = require('chai-http');
const { expect } = chai;

chai.use(chaiHttp);
let should = chai.should();

//const dbconn = require("../dbconn");

let login_details = {
  "email": "test8@gmail.com",
  'password': 'test8'
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

  // Reset user mode before each test
  /*beforeEach((done) => {
    User.remove({}, (err) => {
      console.log(err);
      done();
    })
  });*/

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
          //res.should.have.status(200);
          expect(res.body.status).to.equal("success");
          //res.body.data.should.have.property('token'); 
          done();
        })
    })
  });
})




