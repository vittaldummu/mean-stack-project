// models/User.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');
var LanguageSchema = mongoose.Schema({
        curency_id: mongoose.Schema.Types.ObjectId,
        language_name: String,
        is_active: String,
        created: { 
            type: Date,
            default: Date.now
        }
    },{
        collection: 'languages'
    }
    );

module.exports = mongoose.model('Language', LanguageSchema)