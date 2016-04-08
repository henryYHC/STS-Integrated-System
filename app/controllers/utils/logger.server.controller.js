'use strict';

/**
 * Module dependencies.
 */
var fs = require('fs');

var logfile_path = '/mnt/nfs/Db-Snapshots/db.log';

var formatLog = function(log){
    var now = new Date();
    return now.toISOString() + '\t' + log + '\n';
};

exports.log = function(log){
    fs.open(logfile_path, 'a', function(err, fd){
        if(err) return console.error(err);
        fs.writeSync(fd, formatLog(log));
        fs.closeSync(fd);
    });
};
