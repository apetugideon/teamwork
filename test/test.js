var assert = require("assert");
let chai = require("chai");
let chaiHttp = require("chai-http");
let server = ""; //require("../server");
let should = chai.should();
chai.use(chaiHttp);

const env = process.env.NODE_ENV;
if (env === 'development') {
  server = "https://teamwork-heroku-staging.herokuapp.com"; //require("../server");
} else {
  server = "https://teamwork-heroku-staging.herokuapp.com";
}


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
              const token = response.body.data.token;
              
              //Delete Test User
              describe('Delete Test User', () => {
                it('it should DELETE a test user given the id', (done) => {
                  chai.request(server)
                  .delete('/api/v1/auth/deleteuser/'+response.body.data.userId)
                  .set({"Authorization" : "Bearer " + token})
                  .end((err, response2) => {
                    console.log("2res === " + token, response2.body);
                    response2.should.have.status(201);
                    response2.body.should.be.a('object');
                    response2.body.should.have.property('status').eql('success');
                    console.log("TestUser Deleted");
                    done();
                  });
                });
              });

              done();
            });
          });
        });

        done();
      });
  });
})