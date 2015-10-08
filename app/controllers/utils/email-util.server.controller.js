'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    _ = require('lodash'),
    fs = require('fs'),
    nodemailer = require('nodemailer'),
    Checkin = mongoose.model('Checkin'),
    smtpTransport = require('nodemailer-smtp-transport');

var credentialFilePath = __dirname + '/../../credentials/EmailConfig.json',
    credentialFile = fs.readFileSync(credentialFilePath, 'utf8'),
    credential = JSON.parse(credentialFile);

var transporter = nodemailer.createTransport(smtpTransport(credential));
var templateDirPath = __dirname + '/../../templates/email/';

exports.test = function(req, res){
    res.status(200);
};

exports.sendCheckinReceipt = function(email, id, items, name){
    var temp = fs.readFileSync(templateDirPath+'CheckinReceipt.json', 'utf8');
    var template = JSON.parse(temp); var attachmentName = 'STS Check-in Receipt.pdf';

    template.to = email;
    template.attachments = [{  filename: attachmentName, path: templateDirPath + 'static/'+attachmentName}];

    var itemsString = items.join(', ');
    template.text = template.text.replace('<ID>', id);
    template.text = template.text.replace('<ITEMS>', itemsString);
    template.text = template.text.replace('<NAME>', name);

    template.html = template.html.replace('<ID>', id);
    template.html = template.html.replace('<ITEMS>', itemsString);
    template.html = template.html.replace('<NAME>', name);

    transporter.sendMail(template, function(err, info){
        if(err) return console.log(err);
        if(info.accepted.length > 0)
            Checkin.findById(id, function(err, checkin){
                if(err) return console.log(err);
                checkin.emailSent = true;
                checkin.save(function(err, response){
                    if(err) return console.log(err);
                });
            });
    });
};
