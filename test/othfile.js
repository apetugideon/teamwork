let dbconn = require("../dbconn");
let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../server"); 
let should = chai.should();
chai.use(chaiHttp);

//server = "https://teamwork-heroku-staging.herokuapp.com";

describe('/GET ', () => {
    it('it should Test the App.js file ', (done) => {
        chai.request(server)
        .get('/app.js')
        .end((err, res) => {
            console.log("+++++++++++++",res.ok);
            res.should.have.status(200);
            res.should.have.property('error').eql(false);
            res.should.have.property('ok').eql(true);
            /*res.body.should.have.property('complete').eql(true);
            res.body.should.have.property('method').eql(null);
            res.body.should.have.property('statusCode').eql(200);
            res.body.should.have.property('statusMessage').eql("OK");*/
            done();
        });
    });
});