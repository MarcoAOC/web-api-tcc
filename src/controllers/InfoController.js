const mongoose = require('mongoose');
const Mote = mongoose.model('Mote');
const SensorData = mongoose.model('SensorData');

module.exports = {
    async getQntyInfos(req,res){
        const userId = req.userId;
        const motes = await Mote.find({
            "userId" : userId
        });
        if(motes.length<=0){
            return res.status(400).json({ error: "Motes not founded" })
        }
        var motesQntty = motes.length;
        var sensorsQntty =0;
        var actuatorsQntty =0;
        for(mote of motes){
            const sensorData = await SensorData.findOne(
                {
                    "moteNetId": mote.moteNetId,
                    "userId" : userId
                }
            ).sort({ created_at: 'asc', _id: -1 });
            if(sensorData){

                sensorsQntty+=(sensorData.sensors && sensorData.sensors.length) || 0;
                actuatorsQntty+=(sensorData.actuators && sensorData.actuators.length) || 0;
            }
        }
        return res.json({sensorsQntty,motesQntty,actuatorsQntty});
    }
}