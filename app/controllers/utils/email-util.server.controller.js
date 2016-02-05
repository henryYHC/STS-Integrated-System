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

exports.sendEmail_REST = function(req, res){
    var email = req.body;

    var temp = fs.readFileSync(templateDirPath+'DefaultTemplate.json', 'utf8');
    var template = JSON.parse(temp);

    template.to = email.email;
    template.subject = email.subject;

    template.text = template.text.replace('<NAME>', email.name);
    template.html = template.html.replace('<NAME>', email.name);
    template.text = template.text.replace('<BODY>', email.body);
    template.html = template.html.replace('<BODY>', email.body);

    transporter.sendMail(template, function(err, info){
        if(err || info.accepted.length <= 0)
            res.status(400).send('Failed to send the email.');
        else res.status(200).send('Email sent successfully');
    });


};

exports.sendEmail = function(email, subject, name, body){
    var temp = fs.readFileSync(templateDirPath+'DefaultTemplate.json', 'utf8');
    var template = JSON.parse(temp);

    template.to = email;
    template.subject = subject;

    template.text = template.text.replace('<NAME>', name);
    template.html = template.html.replace('<NAME>', name);
    template.text = template.text.replace('<BODY>', body);
    template.html = template.html.replace('<BODY>', body);

    transporter.sendMail(template, function(err, info){
        if(err) return console.error(err);
        if(info.accepted.length <= 0)
            console.log('Email failed to send.');
    });
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
        if(err) return console.error(err);
        if(info.accepted.length > 0)
            Checkin.findById(id, function(err, checkin){
                if(err) return console.error(err);
                checkin.receiptEmailSent = true;
                checkin.save(function(err, response){
                    if(err) return console.error(err);
                });
            });
    });
};

exports.sendPickupReceipt = function(email, id, items, name){
    var temp = fs.readFileSync(templateDirPath+'PickupReceipt.json', 'utf8');
    var template = JSON.parse(temp);

    template.to = email;

    var itemsString = items.join(', ');
    template.text = template.text.replace('<ID>', id);
    template.text = template.text.replace('<ITEMS>', itemsString);
    template.text = template.text.replace('<NAME>', name);

    template.html = template.html.replace('<ID>', id);
    template.html = template.html.replace('<ITEMS>', itemsString);
    template.html = template.html.replace('<NAME>', name);

    transporter.sendMail(template, function(err, info){
        if(err) return console.error(err);
        if(info.accepted.length > 0)
            Checkin.findById(id, function(err, checkin){
                if(err) return console.error(err);
                checkin.pickupEmailSent = true;
                checkin.save(function(err, response){
                    if(err) return console.error(err);
                });
            });
    });
};

exports.sendServiceLog = function(email, id, items, logs, name){
    var temp = fs.readFileSync(templateDirPath+'ServiceLog.json', 'utf8');
    var template = JSON.parse(temp);
    template.to = email;

    var i, logString, itemsString = items.join(', ');

    logString = '';
    for(i = 0; i < logs.length; i++){
        logString += '<li>';
        logString += logs[i].description;
        logString += '</li>';
    }

    template.html = template.html.replace('<ID>', id);
    template.html = template.html.replace('<NAME>', name);
    template.html = template.html.replace('<ITEMS>', itemsString);
    template.html = template.html.replace('<LOG>', logString);

    logString = '';
    for(i = 0; i < logs.length; i++){
        logString += logs[i].description;
        logString += '\n';
    }

    template.text = template.text.replace('<ID>', id);
    template.text = template.text.replace('<NAME>', name);
    template.text = template.text.replace('<ITEMS>', itemsString);
    template.text = template.text.replace('<LOG>', logString);

    transporter.sendMail(template, function(err, info){
        if(err) return console.error(err);
        if(info.accepted.length > 0)
            Checkin.findById(id, function(err, checkin){
                if(err) return console.error(err);
                checkin.logEmailSent = true;
                checkin.save(function(err, response){
                    if(err) return console.error(err);
                });
            });
    });
};

exports.sendSurvey_routine = function(email, name){
    var temp = fs.readFileSync(templateDirPath+'Survey.json', 'utf8');
    var template = JSON.parse(temp);

    template.to = email;
    template.html = template.html.replace('<NAME>', name);
    template.text = template.text.replace('<NAME>', name);

    transporter.sendMail(template, function(err, info){
        if(err) return console.log(err);
        if(info.accepted.length <= 0)
            console.error('Email failed to send.');
    });
};
