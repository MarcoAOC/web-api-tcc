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
    async createSensorData(req, res) {
        const userId = req.userId;
        const { sensors, actuators, moteNetId, createdAt } = req.body;
    
        const sensorData = await SensorData.create({
          sensors,
          actuators,
          moteNetId,
          userId,
          createdAt
        });
        return res.json(sensorData)
    },
    async deleteAll(req,res){
        await SensorData.remove({moteNetId:1})
        return res.status(200)
    },
    async getRecentByMoteId(req,res){
        const userId = req.userId;
        const moteId = req.params.moteId;
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
        ).sort({ createdAt: 'asc', _id: -1 });
        return res.json(sensorData)
    },
    async getByDayAndByMoteId(req,res){
        const userId = req.userId;
        const {moteId} = req.params;
        const {startDate, endDate} = req.query;

        const mote = await Mote.findOne({
            "userId" : userId,
            "moteNetId": moteId
        });
        if(mote==null){
            return res.status(400).json({ error: "Mote not founded" })
        }
        const parsedStartDate = new Date(startDate)
        parsedStartDate.setHours(0,0,0,0)
        const parsedEndDate = new Date(endDate)
        parsedEndDate.setHours(23,59,59,0)
        console.log(parsedStartDate.toISOString())
        console.log(parsedEndDate.toISOString())
        const sensorData = await SensorData.find(
            {
                "moteNetId": mote.moteNetId,
                "userId":userId,
                "createdAt":{
                    $gte: parsedStartDate,
                    $lt: parsedEndDate
                }
            }
        ).sort({ createdAt: 'asc', _id: -1 });
        return res.json(sensorData)
    }
};