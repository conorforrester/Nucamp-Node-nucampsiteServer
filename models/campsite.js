const mongoose = require('mongoose');
const Schema = mongoose.Schema; //making shorthand to the mongoose.schema function, so we can refer to it as schema instead of mongoose.schema

require('mongoose-currency').loadType(mongoose);    //loads currency type into mongoose
const Currency = mongoose.Types.Currency;   //shorthand for mongoose.TYpes.Currency

const commentSchema = new Schema({
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});


const campsiteSchema = new Schema({ //instantiates new object named campsiteSchema
    name: {
        type: String,
        required: true, //document requires a name property
        unique: true    //name must be unique
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    elevation: {
        type: Number,
        required: true
    },
    cost: {
        type: Currency,
        required: true,
        min: 0
    },
    featured: {
        type: Boolean,
        default: false
    },
    comments: [commentSchema]   //comments property causes every Campsite document to be able to contain mutliple comment documents stored within an array
}, {
    timestamps: true    //timestamps - causes mongoose to add two properties to the schema called createdAt and updatedAt
});

//create model, Campsite, for the data
const Campsite = mongoose.model('Campsite', campsiteSchema);

module.exports = Campsite;