const mongoose = require('mongoose')
const uuid = require('uuid');

const SensorDataSchema = new mongoose.Schema({
    userId:{
        type: String,
        required: true
    },
    moteNetId: {
        type: Number,
        required: true
    },
    sensors: [{
        port: {
            type: Number,
            required: true
        },
        value: {
            type: Number,
            required: true
        }
    }],
    actuators: [{
        port: {
            type: Number,
            required: true
        },
        portSensorsRelated: {
            type: [Number],
            required: true
        },
        state: {
            type: Boolean,
            required: true
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

mongoose.model("SensorData", SensorDataSchema);