// requires logged out user to access a route
function loggedOut(req, res, next) {
  if (req.session && req.session.userId) {
    return res.redirect('/profile/' + user._id);
  }
  return next();
}

//use to password protect any route in app
function requiresSignin(req, res, next) {
  if  (req.session && req.session.userId) {
    return next();
  } else {
    var err = new Error('You must be logged in to view this page');
    err.status = 401;
    return next(err);
  }

}
module.exports.loggedOut = loggedOut;
module.exports.requiresSignin = requiresSignin;
