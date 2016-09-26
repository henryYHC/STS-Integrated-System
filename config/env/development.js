'use strict';

var defaultEnvConfig = require('./default');

module.exports = {
  app: {
    title: defaultEnvConfig.app.title + ' - Development Environment'
  },
  port: process.env.PORT || 3000,
  db: {
    uri: process.env.MONGOHQ_URL || process.env.MONGOLAB_URI || 'mongodb://' + (process.env.DB_1_PORT_27017_TCP_ADDR || 'localhost') + '/sts-dev',
    options: { user: '', pass: '' }
  },
  log: {
    format: 'dev'
  },
  livereload: true
};
