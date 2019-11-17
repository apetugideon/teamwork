let dbconn = require("../dbconn");
let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../server"); 
let should = chai.should();
chai.use(chaiHttp);

server = "https://teamwork-heroku-staging.herokuapp.com";

describe ("Setup Test User", function() {
    it("Should Create A New Test User", (done) => {
        chai.request(server)
        .post("/api/v1/auth/create-user")
        .send({
            "firstName": "testcase",
            "lastName": "testcase",
            "email": "testcase@gmail.com",
            "password": "testcase",
            "gender": "MALE",
            "jobRole": "ADMIN",
            "department": "ACCOUNT",
            "address": "123, testcase Avenue",
            "fromtest": true
        })
        .end((err, res) => {

            //Test User Token
            const token = res.body.data.token;

            //Feed Testing Start
            describe ("Testing Feed", function() {
                //Feed /GET Testing
                describe('/GET Feed', () => {
                    it('it should GET all the Feed, orderedby createdon', (done) => {
                        chai.request(server)
                        .get('/api/v1/feed')
                        .set({"Authorization" : "Bearer " + token})
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('array');
                            //res.body.length.should.be.eql(0);
                            done();
                        });
                    });
                });
            });
            //Gifs Testing End

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

