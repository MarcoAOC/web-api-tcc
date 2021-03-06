const mongoose = require('mongoose');
const SensorData = mongoose.model('SensorData');
const Mote = mongoose.model('Mote');
const crypto = require('crypto');

const BASETOPIC = process.env.BASE_TOPIC;
const mqtt = require('mqtt');
options={
    clientId:'CLIENT_' + crypto.randomBytes(16).toString('hex'),
    username:process.env.MQTT_USER,
    password:process.env.MQTT_PASSWD
};
var client = mqtt.connect(process.env.URL_MQTT,options);

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
        const mote = await Mote.findOne({
            "userId" : userId,
            "moteNetId": moteId
        });
        if(mote==null){
            return res.status(400).json({ error: "Mote not founded" })
        }

        const sensorData = await SensorData.findOne(
            {
                "moteNetId": mote.moteNetId,
                "userId":userId
            }
        ).sort({ created_at: 'asc', _id: -1 });
        return res.json(sensorData)
    }
};