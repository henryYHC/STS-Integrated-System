'use strict';

var
  fs = require('fs'),
  _ = require('lodash');

// Module variables
var template_directory = __dirname + '/../../../../public/static/templates';

exports.DELIM = '\n';
exports.EXTENSION = '.txt';
exports.TEMPLATE = {
  CI_WORKFLOW: template_directory + '/checkin'
};

// Helper functions
var getBasename = function(path, withExtension){
  var start = path.lastIndexOf('/');
  start = (start >= 0)? start+1 : 0;

  if(!withExtension){
    var end = path.lastIndexOf('.');
    if(end < 0) end = path.length;
    return path.substring(start, end);
  }
  else return path.substring(start);
};

var split2Entries = function(text, delim){
  var entries = text.split(delim);
  for(var i = entries.length-1; i >=0; i--){
    entries[i] = entries[i].trim();
    if(!entries[i]) entries.splice(i, 1);
  }
  return entries;
};

// Module functions
exports.getTemplateNames = function(path, endsWith){
  var names = fs.readdirSync(path);
  if(endsWith){
    for(var i = names.length-1; i >=0; i--){
      if(!names[i].endsWith(endsWith))
        names.splice(i, 1);
    }
  }
  return names;
};

exports.getTemplate = function(path){
  var text = fs.readFileSync(path, 'utf8');
  return { name: getBasename(path, false), items: split2Entries(text, exports.DELIM) };
};

// REST functions
exports.getCheckinWorkTemplates = function(res, req){
  var template, templates = {},
    names = exports.getTemplateNames(exports.TEMPLATE.CI_WORKFLOW, exports.EXTENSION);
  for(var i in names){
    template = exports.getTemplate(exports.TEMPLATE.CI_WORKFLOW + '/' + names[i]);
    templates[template.name] = template; delete template.name;
  }
  res.json(templates);
};
