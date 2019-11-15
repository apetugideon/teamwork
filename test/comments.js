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

      //Comments Testing Start
      describe ("Testing Comments", function() {

        //Comments /GET Testing
        describe('/GET comments', () => {
          it('it should GET all the comments', (done) => {
            chai.request(server)
            .get('/api/v1/comments')
            .set({"Authorization" : "Bearer " + token})
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('array');
              //res.body.length.should.be.eql(0);
              done();
            });
          });
        });


        //Comments /POST Testing Start
        describe('/POST comments', () => {

          //Comments /POST Testing without postid
          it('it should not POST a comment without postid field', (done) => {
            let comment = {
              posttype:  'Testing',
              userid:  1,
              createdon:  '2019-11-04 22:56:48',
              updatedon:  '2019-11-04 22:56:48'
            };
            chai.request(server)
            .post('/api/v1/comments')
            .set({"Authorization" : "Bearer " + token})
            .send(comment)
            .end((err, res) => {
              res.should.have.status(500);
              res.body.should.be.a('object');
              done();
            });
          });


          //Comments /POST Testing without userid
          it('it should not POST a comment without userid field', (done) => {
            let comment = {
              posttype:  'Testing',
              createdon:  '2019-11-04 22:56:48',
              updatedon:  '2019-11-04 22:56:48',
              postid:  1
            };
            chai.request(server)
            .post('/api/v1/comments')
            .set({"Authorization" : "Bearer " + token})
            .send(comment)
            .end((err, res) => {
              res.should.have.status(500);
              res.body.should.be.a('object');
              done();
            });
          });


          //Final Comments /POST Testing
          it('it should POST a comment ', (done) => {
            let comment = {
              posttype:'Testing',
              createdon:'2019-11-04 22:56:48',
              updatedon:'2019-11-04 22:56:48',
              postid:1,
              userid:1
            };
            chai.request(server)
            .post('/api/v1/comments')
            .send(comment)
            .set({"Authorization" : "Bearer " + token})
            .end((err, res) => {
              res.should.have.status(201);
              res.body.should.be.a('object');
              res.body.should.have.property('status').eql('success');
              
              let commentID = res.body.data[0].id;

              //Comments /GET/:id Testing Start
              describe('/GET/:id comment', () => {
                it('it should GET a comment by the given id', (done) => {
                  //let commentID = 10;
                  chai.request(server)
                  .get('/api/v1/comments/'+commentID)
                  .set({"Authorization" : "Bearer " + token})
                  .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status').eql('success');
                    done();
                  });
                });
              });
              //Comments /GET/:id Testing End


              //Comments /PUT/:id Testing Start
              describe('/PUT/:id comment', () => {
                it('it should UPDATE a comment given the id', (done) => {
                  //let commentID = 10;
                  let comment = {
                    posttype:'Testing',
                    createdon:'2019-11-04 22:56:48',
                    updatedon:'2019-11-04 22:56:48',
                    postid:1,
                    userid:1
                  }
                  chai.request(server)
                  .put('/api/v1/comments/'+commentID)
                  .set({"Authorization" : "Bearer " + token})
                  .send(comment)
                  .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status').eql('success');
                    done();
                  });
                });
              });
              //Comments /PUT/:id Testing End


              //Comments /DELETE/:id Testing Start
              describe('/DELETE/:id comment', () => {
                it('it should DELETE a comment given the id', (done) => {
                  //let commentID = 10;
                  chai.request(server)
                  .delete('/api/v1/comments/'+commentID)
                  .set({"Authorization" : "Bearer " + token})
                  .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status').eql('success');
                    done();
                  });
                });
              });
              //Comments /DELETE/:id Testing End


              done();
            });
          });

        });
        //Comments /POST Testing End

      });
      //Comments Testing End


      done();
    });
  });
});
