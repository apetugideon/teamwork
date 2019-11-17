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

      //Articles Testing Start
      describe ("Testing Articles", function() {

        //Articles /GET Testing
        describe('/GET articles', () => {
          it('it should GET all the articles', (done) => {
            chai.request(server)
            .get('/api/v1/articles')
            .set({"Authorization" : "Bearer " + token})
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('array');
              //res.body.length.should.be.eql(0);
              done();
            });
          });
        });


        //Articles /POST Testing Start
        describe('/POST articles', () => {

          //Articles /POST Testing without article
          it('it should not POST a article without article field', (done) => {
            let article = {
              title:  'Testing',
              userid:  1,
              categoryid:  1,
              createdon:  '2019-11-04 22:56:48',
              updatedon:  '2019-11-04 22:56:48'
            };
            chai.request(server)
            .post('/api/v1/articles')
            .set({"Authorization" : "Bearer " + token})
            .send(article)
            .end((err, res) => {
              res.should.have.status(500);
              res.body.should.be.a('object');
              done();
            });
          });


          //Articles /POST Testing without title
          it('it should not POST a article without title field', (done) => {
            let article = {
              userid:  1,
              categoryid:  1,
              createdon:  '2019-11-04 22:56:48',
              updatedon:  '2019-11-04 22:56:48',
              article:  'Testing'
            };
            chai.request(server)
            .post('/api/v1/articles')
            .set({"Authorization" : "Bearer " + token})
            .send(article)
            .end((err, res) => {
              res.should.have.status(500);
              res.body.should.be.a('object');
              done();
            });
          });

          //Final Articles /POST Testing
          it('it should POST a article ', (done) => {
            let article = {
              //categoryid:1,
              createdon:'2019-11-04 22:56:48',
              updatedon:'2019-11-04 22:56:48',
              article:'Testing',
              title:'Testing',
              userid:1
            };
            chai.request(server)
            .post('/api/v1/articles')
            .send(article)
            .set({"Authorization" : "Bearer " + token})
            .end((err, res) => {
              res.should.have.status(201);
              res.body.should.be.a('object');
              res.body.should.have.property('status').eql('success');
              
              let articleID = res.body.data.articleId;

              //Articles /GET/:id Testing Start
              describe('/GET/:id article', () => {
                it('it should GET a article by the given id', (done) => {
                  //let articleID = 10;
                  chai.request(server)
                  .get('/api/v1/articles/'+articleID)
                  .set({"Authorization" : "Bearer " + token})
                  .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status').eql('success');
                    done();
                  });
                });
              });
              //Articles /GET/:id Testing End


              //Articles /PUT/:id Testing Start
              describe('/PUT/:id article', () => {
                it('it should UPDATE a article given the id', (done) => {
                  //let articleID = 10;
                  let article = {
                    //categoryid:1,
                    createdon:'2019-11-04 22:56:48',
                    updatedon:'2019-11-04 22:56:48',
                    article:'Testing',
                    title:'Testing',
                    userid:1
                  }
                  chai.request(server)
                  .put('/api/v1/articles/'+articleID)
                  .set({"Authorization" : "Bearer " + token})
                  .send(article)
                  .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status').eql('success');
                    done();
                  });
                });
              });
              //Articles /PUT/:id Testing End

              //Articles /POST/:id/comment Testing Start
              describe('Should post Articles comment', () => {
                it('it should Should post Articles comment', (done) => {
                  chai.request(server)
                  .post('/api/v1/articles/'+articleID+'/comment')
                  .set({"Authorization" : "Bearer " + token})
                  .send({comment:"this is a test comment"})
                  .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status').eql('success');

                    dbconn.query('DELETE FROM comments WHERE id = $1', [res.body.id])
                    .then((data) => {
                      console.log("Test Comment Deleted");
                    })
                    .catch((error) => {
                      console.log("Test Comment Not Deleted");
                    });

                    done();
                  });
                });
              });
              //Articles /POST/:id/comment Testing Start

              //Articles /DELETE/:id Testing Start
              describe('/DELETE/:id article', () => {
                it('it should DELETE a article given the id', (done) => {
                  //let articleID = 10;
                  chai.request(server)
                  .delete('/api/v1/articles/'+articleID)
                  .set({"Authorization" : "Bearer " + token})
                  .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status').eql('success');
                    done();
                  });
                });
              });
              //Articles /DELETE/:id Testing End


              done();
            });
          });

        });
        //Articles /POST Testing End

      });
      //Articles Testing End


      done();
    });
  });
});
