'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    _ = require('lodash'),
    fs = require('fs');

var templateDirPath = __dirname + '/../../templates/checkin/';

var splitEntries = function(entry_text){
    var i, entries = entry_text.split('\n');
    for(i = entries.length-1; i >= 0; i--){
        entries[i] = entries[i].trim();
        if(!entries[i]) entries.splice(i, 1);
    }
    return entries;
};

exports.getTemplateNames = function(){
    return fs.readdirSync(templateDirPath);
};

exports.getTemplate = function(template){
    template = templateDirPath + template;
    var data = fs.readFileSync(template, 'utf8');

    var start = template.lastIndexOf('/')+ 1, end = template.lastIndexOf('.');
    var templateName = (end < 0)? template.substring(start) :  template.substring(start, end);
    return { name : templateName, items : splitEntries(data) };
};

exports.getTemplates = function(req, res){
    var templates = {}, template;
    var templateNames = module.exports.getTemplateNames();

    for(var i in templateNames){
        template = module.exports.getTemplate(templateNames[i]);
        templates[template.name] = template;
    }
    res.json(templates);
};
