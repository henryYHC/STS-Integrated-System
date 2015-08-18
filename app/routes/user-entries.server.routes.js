'use strict';

module.exports = function(app) {
    var entries = require('../../app/controllers/user-entries.server.controller');

    app.route('/userEntries').post(entries.create);

    app.route('/userEntry/:entryNetId')
        .get(entries.read).put(entries.update).delete(entries.delete);

    app.param('entryNetId', entries.userEntryByNetId);
};
