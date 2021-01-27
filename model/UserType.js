// models/User.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');
var UserTypeSchema = mongoose.Schema({
        usertype_id: mongoose.Schema.Types.ObjectId,
        user_type: String,
        is_active: String,
        created: { 
            type: Date,
            default: Date.now
        }
    },{
        collection: 'user_types'
    }
    );

module.exports = mongoose.model('UserType', UserTypeSchema)