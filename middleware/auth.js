const jwt = require('jsonwebtoken');

module.exports = (request, response, next) => {
  try {
    const token = request.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const { userId } = decodedToken;

    const payLoadParam = userId.split("!~+=");

    console.log("payLoadParam", payLoadParam);

    if ((request.body.userId) && (request.body.userId !== payLoadParam[0])) {
      response.status(401).json({
        error: 'Wrong User Credentials',
      });
    } else {
      request.body.currUserId = payLoadParam[0];
      request.body.currUserRole = payLoadParam[1];
      next();
    }
  } catch (e) {
    response.status(401).json({
      error: 'You do not have the Access right to perform this Action!',
    });
  }
};
