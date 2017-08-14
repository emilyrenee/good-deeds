// requires logged out user to access a route
function loggedOut(req, res, next) {
  if (req.session && req.session.userId) {
    var err = new Error('Please sign out to sign up another user.');
    err.sttus = 401;
    return next(err);
    // return res.redirect('/profile/' + user._id);
  } else {
    var err = new Error('Oops! Something went wrong!');
    err.sttus = 500;
    return next(err);
  }

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
