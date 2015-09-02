'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    _ = require('lodash');

exports.obj2Array = function(obj){
    var array = [];
    for(var i in obj){
        array.push(obj[i]);
    }
    return array;
};

exports.initArray = function(len, value){
    var i, array = [];
    for(i = 0; i < len; i++){
        if(typeof value === 'object')
            value = value.slice();
        array.push(value);
    }
    return array;
};
