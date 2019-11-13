const dbconn = require('.././dbconn');


exports.getAllComments = (request, response, next) => {
  dbconn.query('SELECT * FROM comments')
  .then((data) => {
    const comments = data.rows
    response.status(200).json(comments);
  })
  .catch(error => {
    response.status(500).json({
      error:error
    });
  });
};

exports.createComment = (request, res, next) => {
  let postid = request.body.postid;
  let posttype = request.body.posttype;
  let userid = request.body.userid;

  dbconn.query('INSERT INTO comments (postid,posttype,userid) VALUES ($1, $2, $3) RETURNING id', [
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


exports.getOneComment = (request, response, next) => {
  dbconn.query('SELECT * FROM comments WHERE id = $1', [request.params.id])
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


exports.modifyComment = (request, response, next) => {
  let postid = request.body.postid;
  let posttype = request.body.posttype;
  let userid = request.body.userid;
  let id = request.params.id;

  dbconn.query('UPDATE comments SET postid=$1, posttype=$2, userid=$3 WHERE id=$4', [
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


exports.deleteComment = (request, response, next) => {
  dbconn.query('DELETE FROM comments WHERE id = $1', [request.params.id])
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


