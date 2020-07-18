const mongoose = require('mongoose');
const PointSchema = require('./utils/PointSchema');

const MoteSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    moteNetId: {
        type: String,
        required: true
    },
    userId:{
        type: String,
        required: true
    },
    location: {
        type: PointSchema,
        index: '2dsphere'
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: {
        type: Date,
        default: Date.now()
    }
});

mongoose.model("Mote", MoteSchema);