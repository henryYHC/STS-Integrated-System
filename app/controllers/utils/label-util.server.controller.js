'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    _ = require('lodash'),
    sys = require('sys'),
    path = require('path'),
    exec = require('child_process').exec;

var printScriptPath = 'app/scripts/printLabel.sh';

var runScript = function(command){
    exec(command, function(error, stdout, stderr){
        if(stdout)  console.log('Print Label: ' + stdout);
    });
};

exports.printCheckinLabel = function(num, name, netid, time){
    var i, command = 'sh ' + printScriptPath + ' "' + name +  '" "' + netid +  '" "' + time + '"';
    for(i = 0; i < num; i++) runScript(command);
};
