const dbconn = require('.././dbconn');

exports.getAllAgflags = (request, response, next) => {
  dbconn.query('SELECT * FROM agflags')
  .then((data) => {
    const agflags = data.rows
    response.status(200).json(agflags);
  })
  .catch(error => {
    response.status(500).json({
      error:error
    });
  });
};

exports.createAgflag = (request, res, next) => {
  let postid = request.body.postid;
  let posttype = request.body.posttype;
  let userid = request.body.userid;
  dbconn.query('INSERT INTO agflags (postid,posttype,userid) VALUES ($1, $2, $3) RETURNING id', [
    postid,
    posttype,
    userid
  ])
  .then((data) => {
    res.status(201).json({
      "status":"success",
      "data":data.rows
    });
  })
  .catch((error) => {
    res.status(500).json({
      error: error
    });
  });
};

exports.getOneAgflag = (request, response, next) => {
  dbconn.query('SELECT * FROM agflags WHERE id = $1', [request.params.id])
  .then((data) => {
    response.status(201).json({
      "status":"success",
      "data":data.rows[0]
    });
  })
  .catch((error) => {
    response.status(500).json({
      error:error
    });
  });
};

exports.modifyAgflag = (request, response, next) => {
  let postid = request.body.postid;
  let posttype = request.body.posttype;
  let userid = request.body.userid;
  let id = request.params.id;
  dbconn.query('UPDATE agflags SET postid=$1, posttype=$2, userid=$3 WHERE id=$4', [
    postid,
    posttype,
    userid,
    id
  ])
  .then((data) => {
    response.status(201).json({
      "status":"success",
      "data":data.rows
    });
  })
  .catch((error) => {
    response.status(500).json({
      error: error
    });
  });
};

exports.deleteAgflag = (request, response, next) => {
  dbconn.query('SELECT id, userid FROM agflags WHERE id = $1', [request.params.id])
  .then((data) => {
    if ((data.rows[0].userid != request.body.currUserId) && (Number(request.body.currUserRole) !== 1)) {
      response.status(201).json({
        "status":"Access denied, Kindly Consult the App Admin!",
      });
    } else {
      dbconn.query('DELETE FROM agflags WHERE id = $1', [request.params.id])
      .then((data) => {
        response.status(201).json({
          "status":"success",
          "data":data.rows[0]
        });
      })
      .catch((error) => {
        response.status(500).json({
          error:error
        });
      });
    }
  }).catch((error) => {
    response.status(500).json({
      "status":"Error, Could not Resolve Item to delete!"
    });
  });
};


