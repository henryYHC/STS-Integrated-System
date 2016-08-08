'use strict';

module.exports = function (app) {
  // Root routing
  var system = require('../../../system/server/controllers/system.server.controller.js');
  var users = require('../../../users/server/controllers/users.server.controller.js');
  var walkin = require('../controllers/walkin.server.controller.js');
  var checkin = require('../controllers/checkin.server.controller.js');

  app.route('/api/technician/checkin/setting/transfer')
    .get(system.setting, checkin.getCheckinTransferSetting);

  app.route('/api/technician/checkin/setting/queue')
    .get(system.setting, checkin.getCheckinQueueSetting);

  app.route('/api/technician/checkin/hasTransferred/:walkinId')
    .get(checkin.hasTransferred);

  app.route('/api/technician/checkin/create')
    .post(checkin.create);

  app.route('/api/technician/checkin/update/:checkinId')
    .put(checkin.update);

  app.route('/api/technician/checkin/changeStatus/:checkinId')
    .put(checkin.changeStatus);

  app.route('/api/technician/checkin/checkout/:checkinId')
    .put(checkin.checkout);

  app.route('/api/technician/checkin/view/:checkinId')
    .get(checkin.view);

  app.route('/api/technician/checkin/queue')
    .get(checkin.queue);

  app.route('/api/technician/checkin/logService/:checkinId')
    .post(checkin.logService);

  app.route('/api/technician/checkin/query/month')
    .get(checkin.month);

  app.route('/api/technician/checkin/query/incomplete')
    .get(checkin.incomplete);

  app.route('/api/technician/checkin/query')
    .post(checkin.query);

  app.param('walkinId', walkin.walkinById);
  app.param('checkinId', checkin.checkinById);
  app.param('username', users.userByUsername);
};
