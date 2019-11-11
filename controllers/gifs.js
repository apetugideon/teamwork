const cloud = require('.././cloudImagesConf');
const dbconn = require('.././dbconn');

exports.createGif = (req, res, next) => {
  cloud.uploader.upload(req.file.path, (error, result) => {
    const { title } = req.body;
    const { userId } = req.body;
    const imageUrl = result.url;
    dbconn.query('INSERT INTO gifs(image, title, userId) VALUES($1, $2, $3) RETURNING id,createdon', [
      imageUrl,
      title,
      userId,
    ])
      .then((data) => {
        const gifId = data.rows[0].id;
        const createdOn = data.rows[0].createdon;
        res.json({
          status: 'success',
          data: {
            gifId,
            message: 'GIF image successfully posted',
            createdOn,
            title,
            imageUrl,
          },
        });
      })
      .catch((error) => {
        res.status(500).json({
          error,
        });
      });
  });
  /** .catch((error) => {
    res.status(500).json({
      error: "This error"
    });
  });* */
};
