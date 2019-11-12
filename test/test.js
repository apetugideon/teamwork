const express = require("express");
let dbconn = require("../dbconn");
var assert = require("assert");
let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../server") || "https://teamwork-heroku-staging.herokuapp.com"; 
let should = chai.should();
chai.use(chaiHttp);

/*onst app = express();
if (app.get("env") === "production") {
  server = "https://teamwork-heroku-staging.herokuapp.com";
}*/

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
        "address": "123, Avenue"
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