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
      "address": "123, testcase Avenue"
    })
    .end((err, res) => {

      //Test User Token
      const token = res.body.data.token;

      //Categories Testing Start
      describe ("Testing Categories", function() {

        //Categories /GET Testing
        describe('/GET categories', () => {
          it('it should GET all the categories', (done) => {
            chai.request(server)
            .get('/api/v1/categories')
            .set({"Authorization" : "Bearer " + token})
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('array');
              //res.body.length.should.be.eql(0);
              done();
            });
          });
        });


        //Categories /POST Testing Start
        describe('/POST categories', () => {

          //Categories /POST Testing without userid
          it('it should not POST a category without userid field', (done) => {
            let category = {
              category:  'Testing',
              createdon:  '2019-11-04 22:56:48',
              updatedon:  '2019-11-04 22:56:48',
              updatedby:  1
            };
            chai.request(server)
            .post('/api/v1/categories')
            .set({"Authorization" : "Bearer " + token})
            .send(category)
            .end((err, res) => {
              res.should.have.status(500);
              res.body.should.be.a('object');
              done();
            });
          });


          //Final Categories /POST Testing
          it('it should POST a category ', (done) => {
            let category = {
              category:'Testing',
              createdon:'2019-11-04 22:56:48',
              updatedon:'2019-11-04 22:56:48',
              updatedby:1,
              userid:1
            };
            chai.request(server)
            .post('/api/v1/categories')
            .send(category)
            .set({"Authorization" : "Bearer " + token})
            .end((err, res) => {
              res.should.have.status(201);
              res.body.should.be.a('object');
              res.body.should.have.property('status').eql('success');
              
              let categoryID = res.body.data[0].id;

              //Categories /GET/:id Testing Start
              describe('/GET/:id category', () => {
                it('it should GET a category by the given id', (done) => {
                  //let categoryID = 10;
                  chai.request(server)
                  .get('/api/v1/categories/'+categoryID)
                  .set({"Authorization" : "Bearer " + token})
                  .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status').eql('success');
                    done();
                  });
                });
              });
              //Categories /GET/:id Testing End


              //Categories /PUT/:id Testing Start
              describe('/PUT/:id category', () => {
                it('it should UPDATE a category given the id', (done) => {
                  //let categoryID = 10;
                  let category = {
                    category:'Testing',
                    createdon:'2019-11-04 22:56:48',
                    updatedon:'2019-11-04 22:56:48',
                    updatedby:1,
                    userid:1
                  }
                  chai.request(server)
                  .put('/api/v1/categories/'+categoryID)
                  .set({"Authorization" : "Bearer " + token})
                  .send(category)
                  .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status').eql('success');
                    done();
                  });
                });
              });
              //Categories /PUT/:id Testing End


              //Categories /DELETE/:id Testing Start
              describe('/DELETE/:id category', () => {
                it('it should DELETE a category given the id', (done) => {
                  //let categoryID = 10;
                  chai.request(server)
                  .delete('/api/v1/categories/'+categoryID)
                  .set({"Authorization" : "Bearer " + token})
                  .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status').eql('success');
                    done();
                  });
                });
              });
              //Categories /DELETE/:id Testing End

              done();
            });
            
          });

        });
        //Categories /POST Testing End

      });
      //Categories Testing End

      done();
    });
  });
});
