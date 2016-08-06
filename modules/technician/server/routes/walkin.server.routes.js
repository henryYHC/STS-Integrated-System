'use strict';

module.exports = function (app) {
  // Root routing
  var system = require('../../../system/server/controllers/system.server.controller.js');
  var users = require('../../../users/server/controllers/users.server.controller.js');
  var walkin = require('../controllers/walkin.server.controller.js');

  app.route('/api/technician/walkin/setting')
    .get(system.setting, walkin.getWalkinSetting);

  app.route('/api/technician/walkin/view/:walkinId')
    .get(walkin.view);

  app.route('/api/technician/walkin/queue')
    .get(walkin.getQueue);

  app.route('/api/technician/walkin/update/:walkinId')
    .put(walkin.update);
  
  app.route('/api/technician/walkin/noshow/:walkinId')
    .post(walkin.noshow);

  app.route('/api/technician/walkin/beginService/:walkinId')
    .put(walkin.beginService);

  app.route('/api/technician/walkin/duplicate/:walkinId')
    .post(walkin.duplicate);
  
  app.route('/api/technician/walkin/reassign/:walkinId/:username')
    .post(walkin.reassign);

  app.route('/api/technician/walkin/resolve/:walkinId')
    .put(walkin.resolve);
  
  app.route('/api/technician/walkin/previous/:walkinId/:username')
    .get(walkin.previous);
  
  app.route('/api/technician/walkin/query/today')
    .get(walkin.today);
  
  app.route('/api/technician/walkin/query/month')
    .get(walkin.month);
  
  app.route('/api/technician/walkin/query/unresolved')
    .get(walkin.unresolved);

  app.route('/api/technician/walkin/query')
    .post(walkin.query);

  app.param('walkinId', walkin.walkinById);
  app.param('username', users.userByUsername);
};
