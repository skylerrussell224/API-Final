const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const funfactSchema = new Schema({
    stateCode:{
        type: String,
        required: true,
        unique: true
    },
    funfacts: {
        type : [String],
        required: true
    }
});
module.exports = mongoose.model('funfact', funfactSchema);