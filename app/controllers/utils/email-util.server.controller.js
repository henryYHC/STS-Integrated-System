'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    _ = require('lodash'),
    fs = require('fs'),
    nodemailer = require('nodemailer'),
    smtpTransport = require('nodemailer-smtp-transport');

var credentialFilePath = __dirname + '/../../credentials/EmailConfig.json',
    credentialFile = fs.readFileSync(credentialFilePath, 'utf8'),
    credential = JSON.parse(credentialFile);

var templateFilePath = __dirname + '/../../templates/email/DefaultTemplate.json',
    templateFile = fs.readFileSync(templateFilePath, 'utf8'),
    template = JSON.parse(templateFile);

var transporter = nodemailer.createTransport(smtpTransport(credential));


exports.test = function(req, res){
    transporter.sendMail(template, function(err, info){
        if(err) return console.log(err);
        console.log(info);
    });
};
