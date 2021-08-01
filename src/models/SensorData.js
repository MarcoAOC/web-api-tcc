const mongoose = require("mongoose");
const uuid = require("uuid");

const ValueSchema = new mongoose.Schema({
  value: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
  },
});

const SensorDataSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  moteNetId: {
    type: Number,
    required: true,
  },
  sensors: [
    {
      port: {
        type: Number,
        required: true,
      },
      value: {
        type: ValueSchema,
        required: true,
      },
    },
  ],
  actuators: [
    {
      port: {
        type: Number,
        required: true,
      },
      portSensorsRelated: {
        type: [Number],
        required: true,
      },
      state: {
        type: Boolean,
        required: true,
      },
    },
  ],
  createdAt: {
    type: Number,
    default: new Date().getTime()
  },
});

mongoose.model("SensorData", SensorDataSchema);
