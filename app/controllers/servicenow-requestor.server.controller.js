'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    _ = require('lodash'),
    soap = require('soap');

var SN_WSDL = 'https://emorydev1.service-now.com/u_sts_incident.do?WSDL';

exports.createWalkinIncident = function(walkin){
    soap.createClient(SN_WSDL, function(err, client){
        if(err) console.log(err);
        console.log(client);
    });
};
