const dbconn = require('.././dbconn');

exports.getFeeds = (request, response, next) => {
  dbconn.query(`
    SELECT id, createdon, image, title, userId FROM gifs
    UNION 
    SELECT id, createdon, article, title, userId FROM articles
    ORDER BY createdon ASC`)
  .then((data) => {
    const gifs = data.rows;
    gifs.sort(function(a, b){return b.createdon - a.createdon});
    response.status(200).json(gifs);
  })
  .catch(error => {
    response.status(500).json({
      "status":"Error, Could not fetch records!"
    });
  });
};