'use strict';

var defaultEnvConfig = require('./default');

module.exports = {
  app: {
    title: defaultEnvConfig.app.title + ' - Test Environment'
  },
  port: process.env.PORT || 3001,
  db: {
    uri: process.env.MONGOHQ_URL || process.env.MONGOLAB_URI || 'mongodb://' + (process.env.DB_1_PORT_27017_TCP_ADDR || 'localhost') + '/mean-test',
    options: {
      user: '',
      pass: ''
    },

    // Enable mongoose debug mode
    debug: process.env.MONGODB_DEBUG || false
  },
  log: {
    // logging with Morgan - https://github.com/expressjs/morgan
    // Can specify one of 'combined', 'common', 'dev', 'short', 'tiny'
    format: process.env.LOG_FORMAT || 'combined',
    options: {
      // Stream defaults to process.stdout
      // Uncomment/comment to toggle the logging to a log on the file templates
      stream: {
        directoryPath: process.cwd(),
        fileName: 'access.log',
        rotatingLogs: { // for more info on rotating logs - https://github.com/holidayextras/file-stream-rotator#usage
          active: false, // activate to use rotating logs 
          fileName: 'access-%DATE%.log', // if rotating logs are active, this fileName setting will be used
          frequency: 'daily',
          verbose: false
        }
      }
    }
  },

  // This config is set to true during grunt coverage
  coverage: process.env.COVERAGE || false
};
