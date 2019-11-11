const cloud = require('.././cloudImagesConf');
const dbconn = require('.././dbconn');


exports.getAllGifs = (request, response, next) => {
  dbconn.query('SELECT * FROM gifs')
  .then((data) => {
    const gifs = data.rows
    response.status(200).json(gifs);
  })
  .catch(error => {
    response.status(500).json({
      error:error
    });
  });
};

exports.createGif = (request, res, next) => {
  //console.log("Debugging === ",request.file.path);
  if (request.file) {
    cloud.uploader.upload(request.file.path, (error, result) => {
      //const image = request.body.image;
      const title = request.body.title;
      const userid = request.body.userid;
      const imageUrl = result.url;
      dbconn.query('INSERT INTO gifs (image,title,userid) VALUES ($1, $2, $3) RETURNING id', [
        imageUrl,
        title,
        userid
      ])
      .then((data) => {
        const gifId = data.rows[0].id;
        const createdOn = data.rows[0].createdon;
        res.status(201).json({
          status: 'success',
          data: {
            gifId,
            message: 'GIF image successfully posted',
            createdOn,
            title,
            imageUrl,
          }
        });
      })
      .catch((error) => {
        res.status(500).json({
          error: error
        });
      });
    });
  } else {
    const title = request.body.title;
    const userid = request.body.userid;
    const imageUrl = "No gif";
    dbconn.query('INSERT INTO gifs (image,title,userid) VALUES ($1, $2, $3) RETURNING id', [
      imageUrl,
      title,
      userid
    ])
    .then((data) => {
      const gifId = data.rows[0].id;
      const createdOn = data.rows[0].createdon;
      res.status(201).json({
        status: 'success',
        data: {
          gifId,
          message: 'GIF image successfully posted',
          createdOn,
          title,
          imageUrl,
        }
      });
    })
    .catch((error) => {
      res.status(500).json({
        error: error
      });
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
      error:error
    });
  });
};


exports.modifyGif = (request, response, next) => {
  let image = request.body.image;
  let title = request.body.title;
  let userid = request.body.userid;
  let id = request.params.id;

  dbconn.query('UPDATE gifs SET image=$1, title=$2, userid=$3 WHERE id=$4', [
    image,
    title,
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

exports.deleteGif = (request, response, next) => {
  dbconn.query('SELECT * FROM gifs WHERE id = $1', [request.params.id])
  .then((data) => {
    const gifUrl = data.rows[0].image;
    cloud.uploader.destroy(gifUrl, function(result) {  
      dbconn.query('DELETE FROM gifs WHERE id = $1', [request.params.id])
      .then((data2) => {
        response.status(201).json({
          "status":"success",
          "data":data2.rows[0]
        });
      })
      .catch((error) => {
        response.status(500).json({
          error:error
        });
      });
    });
  })
  .catch((error) => {
    response.status(500).json({
      error:error
    });
  });
};


