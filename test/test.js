process.env.NODE_ENV = "test";

var assert = require("assert");
let chai = require("chai");
let chaiHttp = require("chai-http");
let server = "https://teamwork-heroku-staging.herokuapp.com"; //require("../server");
let should = chai.should();
chai.use(chaiHttp);

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
      .end((err, res) => {//process.env.NODE_ENV

        console.log("server === ", process.env.NODE_ENV);
        console.log(server);
        console.log(res);
        res.should.have.status(201);

        //Test User Token
        const token = res.body.data.token;

        //Test User Login
        it("Should Log A User In", (done) => {
          chai.request(server)
            .post("/api/v1/auth/signin")
            .send({"email": "testcaseuser@gmail.com",'password': 'testcaseuser'})
            .end((err, res) => {
                res.should.have.status(200);
                console.log("Test Passed");
            });
          done();
        });

        //Delete Test User
        describe('Delete Test User', () => {
          it('it should DELETE a test user given the id', (done) => {
            chai.request(server)
            .delete('/api/v1/auth/deleteAdminTestUser/'+res.body.data.userId)
            .set({"Authorization" : "Bearer " + token})
            .end((err, res) => {
              res.should.have.status(201);
              res.body.should.be.a('object');
              res.body.should.have.property('status').eql('success');
              console.log("TestUser Deleted");
              done();
            });
          });
        });
        
        done();
      });
  });
})