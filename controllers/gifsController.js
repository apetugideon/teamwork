const cloud = require('.././cloudImagesConf');
const dbconn = require('.././dbconn');
const jwt = require('jsonwebtoken');

exports.getAllGifs = (request, response, next) => {
  dbconn.query('SELECT * FROM gifs')
  .then((data) => {
    const gifs = data.rows;
    response.status(200).json(gifs);
  })
  .catch(error => {
    response.status(500).json({
      "status":"Error, Could not fetch records!"
    });
  });
};

exports.createGif = (request, res, next) => {
  if (request.file) {
    if (!request.body.currUserId) {
      const token = request.headers.authorization.split(' ')[1];
      const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
      const { userId } = decodedToken;
      const payLoadParam = userId.split("!~+=");

      request.body.currUserId = payLoadParam[0];
      request.body.currUserRole = payLoadParam[1];
    }

    if (request.file.mimetype != "image/gif") {
      return res.status(500).json({
        status: 'failed',
        "message":"Image file is not Gif!"
      });
    }

    cloud.uploader.upload(request.file.path, (error, result) => {
      const title = request.body.title;
      const userid = request.body.currUserId;
      const imageUrl = result.url;
      dbconn.query('INSERT INTO gifs (image,title,userid) VALUES ($1, $2, $3) RETURNING id,createdon', [
        imageUrl,
        title,
        userid
      ])
      .then((data) => {
        const gifId = data.rows[0].id;
        const createdOn = data.rows[0].createdon;
        return res.status(201).json({
          status: 'success',
          data: {
            gifId,
            message: 'GIF image successfully posted',
            createdOn,
            title,
            imageUrl
          }
        });
      })
      .catch((error) => {
        return res.status(500).json({
          "status":"Error, Could not save record!"
        });
      });
    })
    .catch((error) => {
      return res.status(500).json({
        "status":"failed",
        "message":error
      });
    });;
  } else {
    return res.status(500).json({
      "message":"No Gif image to upload"
    });
  }
};


exports.getOneGif = (request, response, next) => {
  dbconn.query('SELECT * FROM gifs WHERE id = $1', [request.params.id])
  .then((data) => {
    response.status(201).json({
      "status":"success",
      "data":data.rows[0]
    });
  })
  .catch((error) => {
    response.status(500).json({
      "status":"Error, Could not fetch record!"
    });
  });
};


exports.modifyGif = (request, res, next) => {
  if (request.file) {
    cloud.uploader.upload(request.file.path, (error, result) => {
      const title = request.body.title;
      const userid = request.body.currUserId;
      const imageUrl = result.url;
      const id = request.params.id;
      dbconn.query('UPDATE gifs SET image=$1, title=$2, userid=$3 WHERE id=$4', [
        imageUrl,
        title,
        userid,
        id
      ])
      .then((data) => {
        const gifId = id;
        return res.status(201).json({
          status: 'success',
          data: {
            gifId,
            message: 'GIF image successfully Updated',
            title,
            imageUrl,
          }
        });
      })
      .catch((error) => {
        return res.status(500).json({
          "status":"Error, Could not save record!"
        });
      });
    });
  } else {
    const title = request.body.title;
    const userid = request.body.currUserId;
    const imageUrl = "No gif";
    const id = request.params.id;
    dbconn.query('UPDATE gifs SET image=$1, title=$2, userid=$3 WHERE id=$4', [
      imageUrl,
      title,
      userid,
      id
    ])
    .then((data) => {
      const gifId = id;
      return res.status(201).json({
        status: 'success',
        data: {
          gifId,
          message: 'GIF image successfully Updated',
          title,
          imageUrl,
        }
      });
    })
    .catch((error) => {
      return res.status(500).json({
        "status":"Error, Could not save record!"
      });
    });
  }
};


exports.deleteGif = (request, response, next) => {
  dbconn.query('SELECT id, userid FROM gifs WHERE id = $1', [request.params.id])
  .then((data) => {
    if ((data.rows[0].userid != request.body.currUserId) && (Number(request.body.currUserRole) !== 1)) {
      response.status(201).json({
        "status":"Access denied, You need Admin Access to delete others Gifs!",
      });
    } else {   
      dbconn.query('SELECT * FROM gifs WHERE id = $1', [request.params.id])
      .then((data) => {
        const gifUrl = data.rows[0].image;
        cloud.uploader.destroy(gifUrl, function(result) {  
          dbconn.query('DELETE FROM gifs WHERE id = $1', [request.params.id])
          .then((data2) => {
            response.status(201).json({
              status: 'success',
              data: {
                message: 'Gif post successfully deleted'
              }
            });
          })
          .catch((error) => {
            response.status(500).json({
              "message":"Error, Could not delete record!",
              error: error
            });
          });
        });
      })
      .catch((error) => {
        response.status(500).json({
          "message":"Error, Could not delete record!",
          error: error
        });
      });
    }
  }).catch((error) => {
    response.status(500).json({
      "message":"Error, Could not delete record!",
      error: error
    });
  });
};

exports.createCommentGif = (request, res, next) => {
  let gifId = request.params.id;
  let posttype = "GIF";
  let userid = request.body.currUserId;
  let comment = request.body.comment;
  dbconn.query('SELECT title FROM gifs WHERE id = $1', [gifId])
  .then((gifdata) => {
    let gifTitle = gifdata.rows[0].title;
    dbconn.query('INSERT INTO comments (postid,posttype,userid,comment) VALUES ($1, $2, $3, $4) RETURNING comment,createdon,id', [
      gifId,
      posttype,
      userid,
      comment
    ])
    .then((commdata) => {
      commdata.rows[0].message = "comment successfully created";
      commdata.rows[0].gifTitle = gifTitle;
      res.status(201).json({
        "status":"success",
        "data":commdata.rows[0]
      });
    })
    .catch((error) => {
      res.status(500).json({
        error: error
      });
    });
  })
  .catch((error) => {
    response.status(500).json({
      "status":"Error, Could not fetch record!"
    });
  });
};