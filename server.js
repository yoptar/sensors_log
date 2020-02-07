const config = require('./app/config');
const Readings = require('./app/models/readings.model')

const http = require('http')
const express = require('express');
const mongoose = require('mongoose');
const WebSocket = require('ws');

mongoose.Promise = global.Promise;

// Connecting to the database
mongoose.connect(config.dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(() => {
    console.log("Successfully connected to the database");    
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});

// create express app
const app = express();
const server = http.createServer(app);

// define a simple route
app.get('/log-readings', (req, res) => {
    let {'sensor-id': sensorId, co2, temperature, pressure, humidity} = req.query

    if( !sensorId ){
        res.status(500).send('No sensor id was sent');
    }

    let data = {sensorIP: req.ip, sensorId, co2, temperature, pressure, humidity}
    Readings.create(data, (err, doc) => {
        wss.clients.forEach((ws) => {
            ws.send(JSON.stringify([doc]));
        })
    });
    
    res.json(data);
});

// WebSockets
const wss = new WebSocket.Server({server, path: '/socket'});

wss.on('connection', (ws) => {
    ws.on('message', (number) => {
        Readings.find({}).sort({time: -1}).limit(Number.parseInt(number)).lean().exec((err, docs) => {
            ws.send(JSON.stringify(docs));
        });
    });
});

// listen for requests
server.listen(config.port, config.host, () => {
    console.log(`Server is listening on port ${server.address().port}`);
});