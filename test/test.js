var assert = require("assert");
let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../server");
let should = chai.should();
chai.use(chaiHttp);


describe ("User Management Module Testing", function(){

  let login_details = {
    "email": "test7@gmail.com",
    'password': 'test7'
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

  it("Should Should Create A New User", (done) => {
      chai.request(server)
        .post("/api/v1/auth/create-user/")
        .send(register_details)
        .end((err, res) => {
            res.should.have.status(201);
            console.log("Test Passed");
        });
      done();
  });

  it("Should Should Log A User In", (done) => {
    chai.request(server)
      .post("/api/v1/auth/signin/")
      .send(login_details)
      .end((err, res) => {
          res.should.have.status(200);
          console.log("Test Passed");
      });
    done();
  });

})