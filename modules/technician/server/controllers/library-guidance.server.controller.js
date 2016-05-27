'use strict';

var mongoose = require('mongoose'),
  
  User = mongoose.model('User'),
  LibraryGuidance = mongoose.model('LibraryGuidance');

exports.log = function (req, res) {
  var event = new LibraryGuidance(req.body);
  event.user = req.user;

  event.save(function(err){
    if(err){
      console.error(err);
      res.sendStatus(500);
    }
    else res.sendStatus(200);
  });
};
