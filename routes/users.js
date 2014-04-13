/*
 * GET userslist
 */

exports.list = function(db) {
  return function(req, res) {
    db.users.find(function(err, users) {
	    if(err) res.send(err);
	    else if(!users) res.send("No users.");
	    else res.send(users);
	  });
  }
};


/*
 * POST user
 */

exports.add = function(db) {

  user = {email: "srirangan@gmail.com", password: "iLoveMongo", sex: "male"};
  return function(req, res) {
    db.users.save(user, function(err, saved) {
      if(err) res.send(err);
      else if(!saved) res.send(false);
      else res.send(true);
    });
  }
};


/*
 * DELETE user
 */

exports.delete = function(db) {

  return function(req, res) {

    // userid = req.params.id;
    userid = "534a8c5690b5414f55baead1";
    user = "{'_id', ObjectId("+userid+")}";

    db.users.remove(user, function(err, removed) {
      if(err) res.send(err);
      else if(!removed) res.send(false);
      else res.send(true);
    });
  }
};


/*
 * PATCH user
 */

exports.update = function(db) {

  userid = "534a8c051fa6211555b67628";
  user = "{'_id', ObjectId("+userid+")}";
  patch = "{$set: {password: 'testPass'}}";
  return function(req, res) {
    db.users.remove(user, patch, function(err, updated) {
      if(err) res.send(err);
      else if(!updated) res.send(false);
      else res.send(true);
    });
  }
};
