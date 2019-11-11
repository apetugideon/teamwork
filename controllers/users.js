const bcrypt   = require('bcrypt');
const jwt      = require('jsonwebtoken');
const dbconn   = require(".././dbconn");

exports.signup = (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then((hash) => {
    dbconn.query('INSERT INTO users(firstName, lastName, email, password, gender, jobRole, department, address) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id', [
      req.body.firstName, 
      req.body.lastName, 
      req.body.email, 
      hash, 
      req.body.gender, 
      req.body.jobRole, 
      req.body.department, 
      req.body.address
    ])
    .then((data) => {
      const userId = data.rows[0].id;
      const token  = jwt.sign({userId:userId}, 'RANDOM_TOKEN_SECRET', {expiresIn:'24h'});
      res.status(201).json({
        "status":"success",
        "data":{
          "message":"User account successfully created",
          "token":token,
          "userId":userId
        }
      });
    })
    .catch((error) => {
      res.status(500).json({
        error: error
      });
    });
  });
};


exports.signin = (request, response, next) => {
  dbconn.query('SELECT * FROM users WHERE email = $1', [request.body.email])
  .then((data) => {
    const user = data.rows[0];
    bcrypt.compare(request.body.password, user.password).then((valid) => {
      if (!valid) {
        response.status(401).json({
          error: new Error('Incorrect Password')
        });
      }

      const token = jwt.sign({userId:user.id}, 'RANDOM_TOKEN_SECRET', {expiresIn:'24h'});
      response.status(200).json({
        "status":"success",
        "data":{
          "token":token,
          "userId":user.id
        }
      });
    })
    .catch((error) => {
      response.status(401).json({
        error: 'Incorrect Password'
      });
    });
  })
  .catch(error => {
    response.status(500).json({
      error:"Something is wrong"
    });  
  });
};

exports.deleteTestUserNow = (request, response, next) => {
  dbconn.query('DELETE FROM users WHERE id = $1', [request.params.id])
  .then((data) => {
    response.status(201).json({
      "status":"success",
      "data":data.rows[0]
    });
  })
  .catch((error) => {
    console.log("error ===== ", error);
    response.status(500).json({
      error:error
    });
  });
};