const dbconn = require('.././dbconn');


exports.getAllCategories = (request, response, next) => {
  dbconn.query('SELECT * FROM categories')
  .then((data) => {
    const categories = data.rows
    response.status(200).json(categories);
  })
  .catch(error => {
    response.status(500).json({
      error:error
    });
  });
};

exports.createCategory = (request, res, next) => {
  let category = request.body.category;
  let userid = request.body.userid;
  let updatedby = request.body.updatedby;

  dbconn.query('INSERT INTO categories (category,userid,updatedby) VALUES ($1, $2, $3) RETURNING id', [
    category,
    userid,
    updatedby
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


exports.getOneCategory = (request, response, next) => {
  dbconn.query('SELECT * FROM categories WHERE id = $1', [request.params.id])
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


exports.modifyCategory = (request, response, next) => {
  let category = request.body.category;
  let userid = request.body.userid;
  let updatedby = request.body.updatedby;
  let id = request.params.id;

  dbconn.query('UPDATE categories SET category=$1, userid=$2, updatedby=$3 WHERE id=$4', [
    category,
    userid,
    updatedby
,
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


exports.deleteCategory = (request, response, next) => {
  dbconn.query('DELETE FROM categories WHERE id = $1', [request.params.id])
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


