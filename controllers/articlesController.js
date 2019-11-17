const dbconn = require('.././dbconn');


exports.getAllArticles = (request, response, next) => {
  dbconn.query('SELECT * FROM articles')
  .then((data) => {
    const articles = data.rows;
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
  let userid = request.body.currUserId;
  //let categoryid = request.body.categoryid || ""; categoryid
  dbconn.query('INSERT INTO articles (article,title,userid) VALUES ($1, $2, $3) RETURNING id,createdon', [
    article,
    title,
    userid
  ])
  .then((data) => {
    const articleId = data.rows[0].id;
    const createdOn = data.rows[0].createdon;
    res.status(201).json({
      status: 'success',
      data: {
        message: 'GIF image successfully posted',
        articleId,
        createdOn,
        title
      }
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
      "message":"Error, Could not fetch record!",
      error:error
    });
  });
};


exports.modifyArticle = (request, response, next) => {
  let article = request.body.article;
  let title = request.body.title;
  let userid = request.body.currUserId;
  //let categoryid = request.body.categoryid || ""; categoryid
  let id = request.params.id;
  dbconn.query('UPDATE articles SET article=$1, title=$2, userid=$3 WHERE id=$4 AND userid=$5 RETURNING article', [
    article,
    title,
    userid,
    id,
    userid
  ])
  .then((data) => {
    article = data.rows[0].article;
    response.status(201).json({
      status: 'success',
      data: {
        message: 'Article successfully updated',
        title,
        article
      }
    });
  })
  .catch((error) => {
    response.status(500).json({
      "message":"Error, Could not Resolve Item to update!",
      error:error
    });
  });
};

exports.deleteArticle = (request, response, next) => {
  dbconn.query('SELECT id, userid FROM articles WHERE id = $1', [request.params.id])
  .then((data) => {
    if ((data.rows[0].userid != request.body.currUserId) && (Number(request.body.currUserRole) !== 1)) {
      response.status(201).json({
        "message":"Access denied, Kindly Consult the App Admin!",
      });
    } else {
      dbconn.query('DELETE FROM articles WHERE id = $1', [request.params.id])
      .then((data) => {
        response.status(201).json({
          status: 'success',
          data: {
            message: 'Article successfully deleted'
          }
        });
      })
      .catch((error) => {
        response.status(500).json({
          "message":"Error, Could not Delete",
          error:error
        });
      });
    }
  }).catch((error) => {
    response.status(500).json({
      "message":"Error, Could not Resolve Item to delete!",
      error:error
    });
  });
};

exports.createCommentArticle = (request, res, next) => {
  let articleId = request.params.id;
  let posttype = "ARTICLE";
  let userid = request.body.currUserId;
  let comment = request.body.comment;
  dbconn.query('SELECT title,article FROM articles WHERE id = $1', [articleId])
  .then((gifdata) => {
    let articleTitle = gifdata.rows[0].title;
    let article = gifdata.rows[0].article;
    dbconn.query('INSERT INTO comments (postid,posttype,userid,comment) VALUES ($1, $2, $3, $4) RETURNING comment,createdon', [
      articleId,
      posttype,
      userid,
      comment
    ])
    .then((commdata) => {
      commdata.rows[0].message = "comment successfully created";
      commdata.rows[0].articleTitle = articleTitle;
      commdata.rows[0].article = article;
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