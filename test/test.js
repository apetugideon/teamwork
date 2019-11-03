const env = process.env.NODE_ENV || 'test';

const dbconn = require("../dbconn");
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
let expect = chai.expect;
//let server = 'http://localhost:5000';
let server = "https://teamwork-heroku-product.herokuapp.com:" + process.env.PORT;

chai.use(chaiHttp);

let login_details = {
  "email": "test70@gmail.com",
  'password': 'test70'
}

let register_details = {
  "firstName": "test70",
  "lastName": "test70",
  "email": "test70@gmail.com",
  "password": "test70",
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
          res.should.have.status(201);
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
          res.should.have.status(200);
          expect(res.body.status).to.equal("success");
          res.body.data.should.have.property('token'); 
          done();
        })
    })
  });
})




