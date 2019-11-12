let dbconn = require("../dbconn");
let assert = require("assert");
let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../server");
//let server = "https://teamwork-heroku-staging.herokuapp.com";
let should = chai.should();
chai.use(chaiHttp);



describe ("Setup Test User", function() {
  it("Should Create A New Test User", (done) => {
    chai.request(server)
    .post("/api/v1/auth/create-user/")
    .send({
      "firstName": "testcase",
      "lastName": "testcase",
      "email": "testcase@gmail.com",
      "password": "testcase",
      "gender": "MALE",
      "jobRole": "ADMIN",
      "department": "ACCOUNT",
      "address": "123, testcase Avenue"
    })
    .end((err, res) => {

      //Test User Token
      const token = res.body.data.token;

      //Gifs Testing Start
      describe ("Testing Gifs", function() {

        //Gifs /GET Testing
        describe('/GET gifs', () => {
          it('it should GET all the gifs', (done) => {
            chai.request(server)
            .get('/api/v1/gifs')
            .set({"Authorization" : "Bearer " + token})
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('array');
              //res.body.length.should.be.eql(0);
              done();
            });
          });
        });


        //Gifs /POST Testing Start
        describe('/POST gifs', () => {

          //Gifs /POST Testing without image
          /*it('it should not POST a gif without image field', (done) => {
            let gif = {
              title:  'Testing',
              userid:  1,
              createdon:  '2019-11-04 22:56:48',
              updatedon:  '2019-11-04 22:56:48'
            };
            chai.request(server)
            .post('/api/v1/gifs')
            .set({"Authorization" : "Bearer " + token})
            .send(gif)
            .end((err, res) => {
              res.should.have.status(500);
              res.body.should.be.a('object');
              done();
            });
          });*/


          //Gifs /POST Testing without title
          it('it should not POST a gif without title field', (done) => {
            let gif = {
              userid:  1,
              createdon:  '2019-11-04 22:56:48',
              updatedon:  '2019-11-04 22:56:48',
              image:  'Testing'
            };
            chai.request(server)
            .post('/api/v1/gifs')
            .set({"Authorization" : "Bearer " + token})
            .send(gif)
            .end((err, res) => {
              res.should.have.status(500);
              res.body.should.be.a('object');
              done();
            });
          });


          //Gifs /POST Testing without userid
          it('it should not POST a gif without userid field', (done) => {
            let gif = {
              createdon:  '2019-11-04 22:56:48',
              updatedon:  '2019-11-04 22:56:48',
              image:  'Testing',
              title:  'Testing'
            };
            chai.request(server)
            .post('/api/v1/gifs')
            .set({"Authorization" : "Bearer " + token})
            .send(gif)
            .end((err, res) => {
              res.should.have.status(500);
              res.body.should.be.a('object');
              done();
            });
          });


          //Final Gifs /POST Testing
          it('it should POST a gif ', (done) => {
            let gif = {
              createdon:'2019-11-04 22:56:48',
              updatedon:'2019-11-04 22:56:48',
              image:'Testing',
              title:'Testing',
              userid:1
            };
            chai.request(server)
            .post('/api/v1/gifs')
            .send(gif)
            .set({"Authorization" : "Bearer " + token})
            .end((err, res) => {
              res.should.have.status(201);
              res.body.should.be.a('object');
              res.body.should.have.property('status').eql('success');

              let gifID = res.body.data.gifId;

              //Gifs /GET/:id Testing Start
              describe('/GET/:id gif', () => {
                it('it should GET a gif by the given id', (done) => {
                  //let gifID = 10;
                  chai.request(server)
                  .get('/api/v1/gifs/'+gifID)
                  .set({"Authorization" : "Bearer " + token})
                  .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status').eql('success');
                    done();
                  });
                });
              });
              //Gifs /GET/:id Testing End


              //Gifs /PUT/:id Testing Start
              describe('/PUT/:id gif', () => {
                it('it should UPDATE a gif given the id', (done) => {
                  //let gifID = 10;
                  let gif = {
                    createdon:'2019-11-04 22:56:48',
                    updatedon:'2019-11-04 22:56:48',
                    image:'Testing',
                    title:'Testing',
                    userid:1
                  }
                  chai.request(server)
                  .put('/api/v1/gifs/'+gifID)
                  .set({"Authorization" : "Bearer " + token})
                  .send(gif)
                  .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status').eql('success');
                    done();
                  });
                });
              });
              //Gifs /PUT/:id Testing End


              //Gifs /DELETE/:id Testing Start
              describe('/DELETE/:id gif', () => {
                it('it should DELETE a gif given the id', (done) => {
                  //let gifID = 10;
                  chai.request(server)
                  .delete('/api/v1/gifs/'+gifID)
                  .set({"Authorization" : "Bearer " + token})
                  .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status').eql('success');
                    done();
                  });
                });
              });
              //Gifs /DELETE/:id Testing End


              done();
            });
          });

        });
        //Gifs /POST Testing End

      });
      //Gifs Testing End

      done();
    });
  });
});


//Delete Test User
describe('Delete Test User', () => {
  it('it should DELETE a test user given the id', (done) => {
    chai.request(server)
    .delete('/api/v1/auth/deleteuser')
    //.set({"Authorization" : "Bearer " + token})
    .end((err, response) => {
      //console.log(response);
      response.should.have.status(201);
      response.body.should.be.a('object');
      response.body.should.have.property('status').eql('success');
      console.log("TestUser Deleted");
      done();
    });
  });
});
