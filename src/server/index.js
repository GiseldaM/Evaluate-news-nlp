var path = require('path')
const express = require('express')
const dotenv = require("dotenv");
const cors = require('cors')
const fetch = require("node-fetch");
const bodyParser = require("body-parser")
const mockAPIResponse = require('./mockAPI.js');

dotenv.config();

const app = express()

app.use(express.static('dist'))

app.use(cors())

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

console.log(__dirname)

app.get('/', function (req, res) {
    res.sendFile('dist/index.html')
})

app.listen(8081, function () {
    console.log('Example app listening on port 8080!')
})

app.get('/test', function (req, res) {
    res.send(mockAPIResponse)
})

const getMeaningCloud = async (url = "") => {
    const response = await fetch(url);
    try {
        const newData = await response.json();
        return newData;
    } catch (error) {
        console.log("error", error);
    }
}

app.post('/meaningCloud', returnMeaningCloudData);
async function returnMeaningCloudData(req, res) {


    const userLink = req.body.url;
    const url = `https://api.meaningcloud.com/sentiment-2.1?key=${process.env.API_ID}&lang=en&url=${userLink}`;
    console.log(url);
    const newData = await getMeaningCloud(url);
    const outputObj = {
        model: newData.model,
        score_tag: newData.score_tag,
        agreement: newData.agreement,
        subjectivity: newData.subjectivity,
        confidence: newData.confidence,
        irony: newData.irony
    }
    console.log(outputObj);
    res.send(outputObj);
}
