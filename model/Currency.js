// models/User.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');
var CurrencySchema = mongoose.Schema({
        currency_id: mongoose.Schema.Types.ObjectId,
        currency_name: String,
		country_name:String,
		currency_symbol:String,
        is_active: String,
        created: { 
            type: Date,
            default: Date.now
        }
    },{
        collection: 'currency'
    }
    );

module.exports = mongoose.model('currency', CurrencySchema)