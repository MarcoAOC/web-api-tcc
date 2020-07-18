const mongoose = require('mongoose');
const Mote = mongoose.model('Mote');


module.exports = {
    async index(req, res) {
        const motes = await Mote.find({"userId" : req.userId});
        return res.json(motes);
    },
    async store(req, res) {
        const {name,moteNetId,latitude,longitude} = req.body;
        const motes = await Mote.find({
            "userId" : req.userId,
            "moteNetId": moteNetId
        });
        if(motes.length>0){
            return res.status(400).json({ error: "moteNetId not unique" })
        }
        const location = {
            type: 'Point',
            coordinates: [latitude,longitude],
        }
        const mote = await Mote.create({
            name,
            moteNetId,
            location,
            userId : req.userId
        });
        return res.json(mote);
    }
};