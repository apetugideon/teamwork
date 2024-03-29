let dbconn = require("../dbconn");
let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../server"); 
let should = chai.should();
chai.use(chaiHttp);

server = "https://teamwork-heroku-staging.herokuapp.com";

describe ("User Management Module Testing", function(){
  it("Should Should Create A New User", (done) => {
      chai.request(server)
      .post("/api/v1/auth/create-user")
      .send({
        "firstName": "testcaseuser",
        "lastName": "testcaseuser",
        "email": "testcaseuser@gmail.com",
        "password": "testcaseuser",
        "gender": "MALE",
        "jobRole": "ADMIN",
        "department": "ACCOUNT",
        "address": "123, Avenue",
        "fromtest": true
      })
      .end((err, res) => {
        res.should.have.status(201);
        done();
      });
  });
});


 //Test User Login
 describe('Test Log User In', () => {
  it("Should Log A User In", (done) => {
    chai.request(server)
    .post("/api/v1/auth/signin")
    .send({"email": "testcaseuser@gmail.com",'password': 'testcaseuser'})
    .end((err, response) => {
      response.should.have.status(200);
      console.log("Test Passed");
      //Test User Token
      //const token = response.body.data.token;

      dbconn.query('DELETE FROM users WHERE email = $1', ["testcaseuser@gmail.com"])
      .then((data) => {
        console.log("Test User Deleted");
      })
      .catch((error) => {
        console.log("Test User Not Deleted");
      });

      done();
    });
  });
});