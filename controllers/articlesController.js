const dbconn = require('.././dbconn');


exports.getAllArticles = (request, response, next) => {
  console.log(request.body)
  dbconn.query('SELECT * FROM articles')
  .then((data) => {
    const articles = data.rows
    response.status(200).json(articles);
  })
  .catch(error => {
    response.status(500).json({
      "status":"Error, Could not fetch record!"
    });
  });
};

exports.createArticle = (request, res, next) => {
  let article = request.body.article;
  let title = request.body.title;
  let userid = request.body.userid;
  let categoryid = request.body.categoryid;

  dbconn.query('INSERT INTO articles (article,title,userid,categoryid) VALUES ($1, $2, $3, $4) RETURNING id', [
    article,
    title,
    userid,
    categoryid
  ])
  .then((data) => {
    res.status(201).json({
      "status":"success",
      "data":data.rows
    });
  })
  .catch((error) => {
    res.status(500).json({
      "status":"Error, Could not save!"
    });
  });
};


exports.getOneArticle = (request, response, next) => {
  dbconn.query('SELECT * FROM articles WHERE id = $1', [request.params.id])
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


exports.modifyArticle = (request, response, next) => {
  let article = request.body.article;
  let title = request.body.title;
  let userid = request.body.userid;
  let categoryid = request.body.categoryid;
  let id = request.params.id;

  dbconn.query('UPDATE articles SET article=$1, title=$2, userid=$3, categoryid=$4 WHERE id=$5', [
    article,
    title,
    userid,
    categoryid,
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
      "status":"Error, Could not Resolve Item to update!"
    });
  });
};


exports.deleteArticle = (request, response, next) => {
  dbconn.query('SELECT id, userid FROM articles WHERE id = $1', [request.params.id])
  .then((data) => {
    if ((data.rows[0].userid != request.body.currUserId) && (Number(request.body.currUserRole) !== 1)) {
      response.status(201).json({
        "status":"Access denied, Kindly Consult the App Admin!",
      });
    } else {
      dbconn.query('DELETE FROM articles WHERE id = $1', [request.params.id])
      .then((data) => {
        response.status(201).json({
          "status":"success",
          "data":data.rows[0]
        });
      })
      .catch((error) => {
        response.status(500).json({
          "status":"Error, Could not Delete"
        });
      });
    }
  }).catch((error) => {
    response.status(500).json({
      "status":"Error, Could not Resolve Item to delete!"
    });
  });
};


