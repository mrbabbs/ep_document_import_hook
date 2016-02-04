var log4js = require('ep_etherpad-lite/node_modules/log4js');
var fs = require('fs');
var path = require('path');
var settings = require('ep_etherpad-lite/node/utils/Settings');
var tool = require('../tools/soffice');

/**
 *  This hook is loaded by ImportHandler.js
 *  see the line 112.
 *
 **/
exports.import = function (hook_nams, args, cb) {
    var apiLogger = log4js.getLogger('import (hook)');
    var fileExt = path.extname(args.srcFile).toLowerCase();
    var cmd = 'soffice';
    var confs = settings.ep_document_import_hook;

    apiLogger.debug('Document Import Hook');
    apiLogger.debug('src: ', args.srcFile);
    apiLogger.debug('dest: ',  args.destFile);

    try {
        if(!confs) {
          apiLogger.debug('No settings');
          return cb([]);
        }

        if (confs != null
                && confs.tool) {
            cmd = confs.tool;
        }
        apiLogger.debug('Lib cmd : ' + cmd);
        /**
         * Check if the file is basic to avoid
         * using the lib to convert the file.
         * ImportHandler.js check if the file is an
         * a supported file, so, is not important
         * check again the other file format
         **/
        if (fileExt === '.html' ||
                fileExt === '.txt') {

            apiLogger.debug('File has a basic extension[txt, html]: ' +
                        fileExt);
            return cb([]);
        }
        apiLogger.debug('Use library to convert file');

        tool.convertFile(cmd, args.srcFile,
                args.destFile,
                'htm',
                cb);
    } catch(err) {
        apiLogger.warn(err.message);
        return cb([]);
    }
};

