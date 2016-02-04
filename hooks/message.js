var eejs = require("ep_etherpad-lite/node/eejs");
var settings = require('ep_etherpad-lite/node/utils/Settings');

exports.eejsBlock_importColumn = function (hook_name, args, cb) {
    if (settings.ep_document_import_hook) {
        args.content =
            eejs.require('ep_document_import_hook/templates/importcolumn.html',
                {}, module);
    }
    return cb();
};
