//let benv  = process.env.NODE_ENV;
//const env = process.env.NODE_ENV || 'test';
let server = require("../server");
const request = require('supertest');
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


describe('POST /users', function () {
  /*let data = {
      "id": "1",
      "name": "dummy",
      "contact": "dummy",
      "address": "dummy"
  }*/

  let data = {
    "firstName": "toyin",
    "lastName": "toyin",
    "email": "toyin@gmail.com",
    "password": "toyin",
    "gender": "MALE",
    "jobRole": "ADMIN",
    "department": "ACCOUNT",
    "address": "123, Avenue"
  };

  it('respond with 201 created', function (done) {
    request(server)
      .post('/api/v1/auth/create-user')
      .send(data)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(201)
      .end((err) => {
          if (err) return done(err);
          done();
      });
  });
});

/*describe('Movie API Tests',()=>{
  it('GET /api/v1/movies/ returns an array of movies', async() => {
      const response = await request(server).post('/api/v1/auth/create-user');
      console.log(response);
      expect(response.status).to.equal(200)
      expect(response.body).to.be.an.instanceof(Array);
  })
});*/

/*describe('Create Account, Login and Check Token', () => {

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
          console.log(res.body);
          //res.should.have.status(200);
          expect(res.body.status).to.equal("success");
          //res.body.data.should.have.property('token'); 
          done();
        })
    })
  });
})*/




