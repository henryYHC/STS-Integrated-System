'use strict';

/**
 * Module dependencies
 */
var
  mongoose = require('mongoose'),
  _ = require('lodash'),
  http = require('http-request'),
  async = require('async'),
  User = mongoose.model('User'),
  UserEntry = mongoose.model('UserEntry'),
  KeyValueList = mongoose.model('KeyValueList'),
  SystemSetting = mongoose.model('SystemSetting');

// Online directory email
var URL_EmoryOnlineDirectory = 'http://directory.service.emory.edu/index.cfm';
var getOnlineDirectoryURL = function(username) {
  return URL_EmoryOnlineDirectory + '?SearchString=' + username;
};

// Online directory result processing
var Regex_OnlineDirectoryResult = new RegExp('<tr>\\W*<td class="label">(.*)\\W*</td>\\W*<td>(&nbsp;|\\W*)?(.*)</td>\\W*</tr>', 'g');
var Regex_OnlineDirectoryName = new RegExp('<tr>\\W*<td>\\W*<div class="cn">(.*)</div>\\W*</td>\\W*</tr>');
var Regex_OnlineDirectoryEntry = new RegExp('<tr>\\W*<td class="label">(.*):\\W*</td>\\W*<td>(&nbsp;|\\W*|<a.*>)?(.*)</td>\\W*</tr>');
var Regex_OnlineDirectoryNotFound = new RegExp('<p.*class="error">(.*)</p>');
var parseOnlineDirectoryResult = function(html){
  var info = { }, not_found = html.match(Regex_OnlineDirectoryNotFound);

  if(!not_found || !not_found[1]){
    var name = html.match(Regex_OnlineDirectoryName);
    if(name && name[1]){
      info.Name = name[1].trim();

      var key, value, start, end;
      var i, entry, entries = html.match(Regex_OnlineDirectoryResult);
      for(i = 0; i < entries.length; i++){
        entry = entries[i].match(Regex_OnlineDirectoryEntry);
        if(entry.length >= 4){
          key = entry[1].trim();
          value = entry[3].trim();

          start = value.indexOf('>');
          end = value.lastIndexOf('<');
          if(start >= 0 && end >= 0)
            value = value.substring(start+1, end);
          info[key] = value;
        }
      }
      return info;
    }
  }
  return null;
};

// Time spans
var four_month = 1000*60*60*24*30*4;

// Validator body
var retrieveSystemSetting = function(username, callback){
  SystemSetting.findOne({}, '-_id user_validation_method user_wildcard_prefixes')
    .exec(function(err, setting){ callback(err, setting, username, { validated: false }); });
};

var validateWithWildcardPrefix = function(setting, username, result, callback){
  if(!result.validated){
    for(var i = 0; i < setting.user_wildcard_prefixes.length; i++){
      if(username.startsWith(setting.user_wildcard_prefixes[i])){
        result.validated = true; result.isValid = true;
        if(!result.level) result.level = 'Wildcard';
      }
    }
  }
  callback(null, setting, username, result);
};

var validateWithUserDatabase = function(setting, username, result, callback){
  result.user = null;

  User.findOne({ username : username }, '-password -roles -salt -profileImageURL -__v -created -updated',
    function(err, user){
      if(user){
        result.user = user; result.validated = true; result.isValid = user.isActive;
        if(!result.level) result.level = 'User';

        var timestamp = (user.lastVisit)? user.lastVisit : (user.updated)? user.updated : user.created;
        var bound = new Date().getTime() - four_month;

        if(timestamp.getTime() <= bound){
          http.post(getOnlineDirectoryURL(username), function(err, res){
            if(res && res.buffer) {
              var directory = parseOnlineDirectoryResult(res.buffer.toString());
              if (directory){
                if (directory.Type)
                  user.isActive = user.verified = directory.Type.toLocaleLowerCase().indexOf('student') >= 0;
              }
              else user.isActive = user.verified = false;

              user.save(function(err){
                callback(err, setting, username, result);
              });
            }
            else callback(err, setting, username, result);
          });
        }
        else callback(err, setting, username, result);
      }
      else callback(err, setting, username, result);
    });
};

var validateWithOnlineDirectory = function(setting, username, result, callback){
  result.directory = null;

  if(!result.validated && setting.user_validation_method === 'Online Directory'){
    http.post(getOnlineDirectoryURL(username), function(err, res){
      var directory = null;
      if(res && res.buffer){
        directory = parseOnlineDirectoryResult(res.buffer.toString());

        if(directory && directory.Type){
          result.validated = true;
          if(!result.level) result.level = 'Online Directory';
          result.isValid = directory.Type.toLocaleLowerCase().indexOf('student') >= 0;
        }
      }
      result.directory = directory;
      callback(err, setting, username, result);
    });
  }
  else callback(null, setting, username, result);
};

var validateWithUserEntryDatabase = function(setting, username, result, callback){
  result.entry = null;

  if(setting.user_validation_method !== 'Manual'){
    if(result.validated && setting.user_validation_method === 'Online Directory' && result.directory){
      // update user entry using online directory
      UserEntry.findOne({ username : username }, function(err, entry){
        if(err) return callback(err, setting, username, result);

        if(entry){
          entry.type = result.directory.Type;
          entry.isActive = result.isValid;
          entry.save(function(err, entry){
            result.entry = entry;
            callback(err, setting, username, result);
          });
        }
        else{
          var idx, firstName = result.directory.Name, lastName = '';
          if((idx = firstName.lastIndexOf(' ')) > 0){
            lastName = firstName.substring(idx+1);
            firstName = firstName.substring(0, idx);
          }

          entry = new UserEntry({
            username: username,
            firstName: firstName,
            lastName: lastName,
            type: result.directory.Type,
            isActive: result.isValid
          });
          entry.save(function(err, entry){
            result.entry = entry;
            callback(err, setting, username, result);
          });
        }
      });
    }
    else if(!result.validated){
      UserEntry.findOne({ username : username }, function(err, entry){
        if(entry){
          result.validated = true;
          if(!result.level) result.level = 'User Entry';
          result.isValid = entry.type.indexOf('student') >= 0;
        }
        result.entry = entry;
        callback(null, setting, username, result);
      });
    }
    else callback(null, setting, username, result);
  }
  else callback(null, setting, username, result);
};

var manualValidation = function(setting, username, result, callback){
  if(!result.validated){
    result.validated = true;

    if (setting.user_validation_method === 'Manual') {
      result.isValid = true;
      if(!result.level) result.level = 'Manual';
    }
    else result.isValid = false;
  }
  callback(null, username, result);
};

exports.validateUsername = function(username, callback){
  async.waterfall(
    [
      async.apply(retrieveSystemSetting, username.toLowerCase()),
      validateWithWildcardPrefix,
      validateWithUserDatabase,
      validateWithOnlineDirectory,
      validateWithUserEntryDatabase,
      manualValidation
    ],
  function(err, username, result){
    if(err){
      console.error(err);
      callback(null);
    }
    callback(result);
  });
};

exports.validate = function(req, res){
  var username = String(req.params.username);
  if(username){
    exports.validateUsername(username, function(result){
      res.json(result);
    });
  }
  else res.status(400).send('Invalid or unspecified username.');
};
