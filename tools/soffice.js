var spawn = require('child_process').spawn;
var async = require('ep_etherpad-lite/node_modules/async');
var path = require('path');
var fs = require('fs');
var queue;
var stdoutCallback = null;
var log4js = require('ep_etherpad-lite/node_modules/log4js');
var apiLogger = new log4js.getLogger('soffice');

/**
 * Create process and execute it
 **/
var spawnSoffice = function (cmd, srcFile, outputDir, type) {
    apiLogger.debug('Spawn process');
    var soffice = spawn(cmd, [
            '--headless',
            '--convert-to',
            type,
            '--outdir',
            outputDir,
            srcFile
    ]);

    apiLogger.debug(cmd, srcFile, outputDir, type);
    var stdoutBuffer = '';

    //append error messages to the buffer
    soffice.stderr.on('data', function (data) {
        apiLogger.error('Data', data);

        stdoutBuffer += data.toString();
    });

    // when the process exits, check is some error is present insiede
    // the stdoutbuffer and pass it to the stdoutcallback
    soffice.on('exit', function (code) {
        apiLogger.debug('Exit process', code);
        var err = stdoutBuffer.search('Error') === -1 ? null : stdoutBuffer;

        //reset the buffer
        stdoutBuffer = '';

        //call the callback with a possible error
        if(stdoutCallback != null) {
            stdoutCallback(err);
            stdoutCallback = null;
        }
    });

    //delegate the processing of stdout to a other function
    soffice.stdout.on('data',function (data) {
        apiLogger.debug('Data on stdout', data);
        //add data to buffer
        stdoutBuffer+=data.toString();
   });
};

/**
 * Manage task to execute
 **/
var doConvertTask = function (task, callback) {
    var outputDir = path.dirname(task.srcFile);
    var extSrcFile = path.extname(task.srcFile).toLowerCase();
    var srcFileConvertedName =
        task.srcFile.replace(extSrcFile, '.' + task.type);
    apiLogger.debug('Start task:');
    apiLogger.debug('cmd: ' + task.cmd)
    apiLogger.debug('srcFile: ' + task.srcFile);
    apiLogger.debug('destFile: ' + task.destFile);
    apiLogger.debug('outputDir: ' + outputDir);
    apiLogger.debug('srcFileConvertedName: ' + srcFileConvertedName);
    apiLogger.debug('fileType: ' + task.type);
    //create a callback that calls the task callback and
    //the caller callback
    stdoutCallback = function (err) {
        callback();
        apiLogger.debug('queue continue');
        try{
            // TODO replace with async
            fs.rename(srcFileConvertedName, task.destFile);
            if (err) {
                apiLogger.error('Task problem: ', err);
                task.callback();
            } else {
                apiLogger.debug('Task completed');
                task.callback([task.destFile]);
            }
        }catch(e){
            apiLogger.error('Task failed: ', e);
            task.callback();
        }
    };

    spawnSoffice(task.cmd, task.srcFile, outputDir, task.type);
};
// create queue
queue = async.queue(doConvertTask, 1);

exports.convertFile = function (cmd, srcFile, destFile, type, callback) {    apiLogger.debug('New task added');
    apiLogger.debug('New convert task');
    queue.push({
        'cmd': cmd,
        'srcFile': srcFile,
        'destFile': destFile,
        'type': type,
        'callback': callback
    });
    apiLogger.debug('Added task to the queue');
};

