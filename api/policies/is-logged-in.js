/**
 * is-logged-in
 *
 * A simple policy that allows any request from an authenticated user.
 *
 * For more about how to use policies, see:
 *   https://sailsjs.com/config/policies
 *   https://sailsjs.com/docs/concepts/policies
 *   https://sailsjs.com/docs/concepts/policies/access-control-and-permissions
 */
const jwt = require('jsonwebtoken');
const secret = require("./../../config/local").security.key;

module.exports = async function (req, res, proceed) {

  if (req.hasOwnProperty("headers") && req.headers.hasOwnProperty("token")) {
    var token = req.headers['token']
    delete req.headers['token']
  } else if (req.query.hasOwnProperty('token')) {
    var token = req.query.token;
    delete req.query.token;
  } else {
    res.status(401);
    res.send({ message: 'not permission' });
    return;
  }

  jwt.verify(token, secret, function (err, decoded) {
    if (err) {
      res.status(401);
      res.send({ message: 'not permission' });
      return;
    }

    proceed();
  });

};
