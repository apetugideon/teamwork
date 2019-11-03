let benv  = process.env.NODE_ENV;
const env = process.env.NODE_ENV || 'test';

const dbconn = require("../dbconn");
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
let expect = chai.expect;

let server = require("../server");

/*if (benv) {
  server = "https://teamwork-heroku-product.herokuapp.com/api/v1/auth";
} else {
  server = "http://localhost:5000/api/v1/auth";
}**/

//server = "https://teamwork-heroku-product.herokuapp.com:";


chai.use(chaiHttp);

let login_details = {
  "email": "test3@gmail.com",
  'password': 'test2'
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




