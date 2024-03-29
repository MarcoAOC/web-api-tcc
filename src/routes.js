const express = require('express');
const routes = express.Router();

const MotesController = require('./controllers/MoteController');
const SensorDataController = require('./controllers/SensorDataController');
const UserController = require('./controllers/UserController');
const InfoController = require('./controllers/InfoController');
const authMiddleware = require("./middlewares/auth");

routes.use("/motes",authMiddleware);
routes.get('/motes', MotesController.index);
routes.post('/motes', MotesController.store);

routes.use("/infos",authMiddleware);
routes.get('/infos', InfoController.getQntyInfos);

routes.use("/data",authMiddleware);
routes.get("/data/:moteId",SensorDataController.getRecentByMoteId);
routes.post("/data",SensorDataController.createSensorData);
routes.delete("/data",SensorDataController.deleteAll);
routes.get("/data/:moteId/byDate",SensorDataController.getByDayAndByMoteId);

routes.use("/mqtt",authMiddleware);
routes.post('/mqtt', SensorDataController.mqttRequestHandler);

routes.post("/register", UserController.registerUser);
routes.post("/authenticate", UserController.authenticateMe);
routes.use("/me",authMiddleware);
routes.get("/me", UserController.getMe);

module.exports = routes;