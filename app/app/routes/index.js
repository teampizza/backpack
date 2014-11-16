var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  var db = req.db;
  var collection = db.get('blacklistCollection');

  collection.find({},{},function(e,docs){
    res.render('index', {
      "blacklist" : docs
    });
  });
});

module.exports = router;
