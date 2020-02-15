const mongoose = require('mongoose');
const Schema = mongoose.Schema; //making shorthand to the mongoose.schema function, so we can refer to it as schema instead of mongoose.schema

const partnerSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        required: true
    },
    featured: {
        type: Boolean,
        default: false
    },
    description: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

//create model, Partner, for the data
const Partner = mongoose.model('Partner', partnerSchema);

module.exports = Partner;