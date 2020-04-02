'use strict';

var mongoose = require('mongoose');
//import mongoose from 'mongoose';

var db = () => {
    return {
        config: (conf) => {
            mongoose.connect('mongodb://localhost/tekbooks' , { useNewUrlParser:    true,
                                                                useUnifiedTopology: true,
                                                                useCreateIndex:     true });
            var db = mongoose.connection;
            db.on('error', console.error.bind(console,'Connection Error'));
            db.once('open', () => {
                console.log('DB Connection Open...')
            });
        }
    }
}

module.exports = db();
//export default db;
