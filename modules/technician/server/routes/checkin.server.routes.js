'use strict';

module.exports = function (app) {
  // Root routing
  var system = require('../../../system/server/controllers/system.server.controller.js');
  var users = require('../../../users/server/controllers/users.server.controller.js');
  var walkin = require('../controllers/walkin.server.controller.js');
  var checkin = require('../controllers/checkin.server.controller.js');

  app.route('/api/technician/checkin/setting')
    .get(system.setting, checkin.getCheckinSetting);

  app.route('/api/technician/checkin/hasTransferred/:walkinId')
    .get(checkin.hasTransferred);

  app.route('/api/technician/checkin/create')
    .post(checkin.create);

  app.route('/api/technician/checkin/view/:checkinId')
    .get(checkin.view);

  app.route('/api/technician/checkin/queue')
    .get(checkin.queue);

  app.param('walkinId', walkin.walkinById);
  app.param('checkinId', checkin.checkinById);
  app.param('username', users.userByUsername);
};
