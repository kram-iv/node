'use strict';

var app = require('./index');
var http = require('http');
var dust = require('dustjs-helpers');

var server;

/*
 * Create and start HTTP server.
 */

server = http.createServer(app);
server.listen(process.env.PORT || 8000);
server.on('listening', function () {
    console.log('Server listening on http://localhost:%d', this.address().port);
});
