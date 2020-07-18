const mongoose = require('mongoose');
const mqtt = require('mqtt');
const fs = require('fs');
var client = mqtt.connect(process.env.URL_MQTT,JSON.parse(process.env.MQTT_CREDENTIALS));
const SensorData = mongoose.model('SensorData');
const Mote = mongoose.model('Mote');
const BASETOPIC = process.env.BASE_TOPIC;
client.on('connect', function() {
    client.subscribe('SensorData');
});

client.on('message', async function(topic, message) {
    await SensorData.create(JSON.parse(message.toString()));
});
module.exports = {
    async mqttRequestHandler(req, res) {
        const userId = req.userId;
        const topic = BASETOPIC + userId;
        await client.publish(topic, JSON.stringify(req.body));
        return res.json("Ok");
    },  
    async getRecentByMoteId(req,res){
        const userId = req.userId;
        const moteId = req.params.moteid;
        const motes = await Mote.find({
            "userId" : userId,
            "moteNetId": moteId
        });
        if(motes.length<=0){
            return res.status(400).json({ error: "Mote not founded" })
        }

        const sensorData = await SensorData.findOne(
            {
                "moteNetId": moteId
            }
        ).sort({ created_at: 'asc', _id: -1 });
        return res.json(sensorData)
    }
};