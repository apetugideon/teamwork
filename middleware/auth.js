const jwt = require('jsonwebtoken');

module.exports = (request, response, next) => {
  try {
    const token = request.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const { userId } = decodedToken;

    if ((request.body.userId) && (request.body.userId !== userId)) {
      response.status(401).json({
        error: 'Wrong User Credentials',
      });
    } else {
      next();
    }
  } catch (e) {
    response.status(401).json({
      error: 'Unauthorized Request',
    });
  }
};
