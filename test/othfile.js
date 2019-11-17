let dbconn = require("../dbconn");
let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../server"); 
let should = chai.should();
chai.use(chaiHttp);

//server = "https://teamwork-heroku-staging.herokuapp.com";

describe('/GET ', () => {
    it('it should GET ', (done) => {
        chai.request(server)
        .get('/app')
        .end((err, res) => {
            //console.log("Entry points ==== ", res);
            done();
        });
    });
});