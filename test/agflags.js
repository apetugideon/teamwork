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

      console.log(res);
      
      //Test User Token
      const token = res.body.data.token;

      //Agflags Testing Start
      describe ("Testing Agflags", function() {

        //Agflags /GET Testing
        describe('/GET agflags', () => {
          it('it should GET all the agflags', (done) => {
            chai.request(server)
            .get('/api/v1/agflags')
            .set({"Authorization" : "Bearer " + token})
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('array');
              //res.body.length.should.be.eql(0);
              done();
            });
          });
        });


        //Agflags /POST Testing Start
        describe('/POST agflags', () => {

          //Agflags /POST Testing without postid
          it('it should not POST a agflag without postid field', (done) => {
            let agflag = {
              posttype:  'Testing',
              userid:  1,
              createdon:  '2019-11-04 22:56:48',
              updatedon:  '2019-11-04 22:56:48'
            };
            chai.request(server)
            .post('/api/v1/agflags')
            .set({"Authorization" : "Bearer " + token})
            .send(agflag)
            .end((err, res) => {
              res.should.have.status(500);
              res.body.should.be.a('object');
              done();
            });
          });


          //Agflags /POST Testing without userid
          it('it should not POST a agflag without userid field', (done) => {
            let agflag = {
              posttype:  'Testing',
              createdon:  '2019-11-04 22:56:48',
              updatedon:  '2019-11-04 22:56:48',
              postid:  1
            };
            chai.request(server)
            .post('/api/v1/agflags')
            .set({"Authorization" : "Bearer " + token})
            .send(agflag)
            .end((err, res) => {
              res.should.have.status(500);
              res.body.should.be.a('object');
              done();
            });
          });


          //Final Agflags /POST Testing
          it('it should POST a agflag ', (done) => {
            let agflag = {
              posttype:'Testing',
              createdon:'2019-11-04 22:56:48',
              updatedon:'2019-11-04 22:56:48',
              postid:1,
              userid:1
            };
            chai.request(server)
            .post('/api/v1/agflags')
            .send(agflag)
            .set({"Authorization" : "Bearer " + token})
            .end((err, res) => {
              res.should.have.status(201);
              res.body.should.be.a('object');
              res.body.should.have.property('status').eql('success');
              
              let agflagID = res.body.data[0].id;

              //Agflags /GET/:id Testing Start
              describe('/GET/:id agflag', () => {
                it('it should GET a agflag by the given id', (done) => {
                  //let agflagID = 10;
                  chai.request(server)
                  .get('/api/v1/agflags/'+agflagID)
                  .set({"Authorization" : "Bearer " + token})
                  .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status').eql('success');
                    done();
                  });
                });
              });
              //Agflags /GET/:id Testing End


              //Agflags /PUT/:id Testing Start
              describe('/PUT/:id agflag', () => {
                it('it should UPDATE a agflag given the id', (done) => {
                  //let agflagID = 10;
                  let agflag = {
                    posttype:'Testing',
                    createdon:'2019-11-04 22:56:48',
                    updatedon:'2019-11-04 22:56:48',
                    postid:1,
                    userid:1
                  }
                  chai.request(server)
                  .put('/api/v1/agflags/'+agflagID)
                  .set({"Authorization" : "Bearer " + token})
                  .send(agflag)
                  .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status').eql('success');
                    done();
                  });
                });
              });
              //Agflags /PUT/:id Testing End


              //Agflags /DELETE/:id Testing Start
              describe('/DELETE/:id agflag', () => {
                it('it should DELETE a agflag given the id', (done) => {
                  //let agflagID = 10;
                  chai.request(server)
                  .delete('/api/v1/agflags/'+agflagID)
                  .set({"Authorization" : "Bearer " + token})
                  .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status').eql('success');
                    done();
                  });
                });
              });
              //Agflags /DELETE/:id Testing End


              done();
            });
          });

        });
        //Agflags /POST Testing End

      });
      //Agflags Testing End


      done();
    });
  });
});
