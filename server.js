const express = require('express');
const cors = require('cors');
const server = express();
const mongoose= require('mongoose');
const { default: axios } = require('axios');
require('dotenv').config();
server.use(cors());
server.use(express.json());
mongoose.connect('mongodb://localhost:27017/digimos', { useNewUrlParser: true, useUnifiedTopology: true });

const digimoSchema = new mongoose.Schema({
    name: String,
    level: String,
    img: String
});
const digimonModel =  mongoose.model('digimon', digimoSchema);



server.listen(3001,()=> {
    console.log("listeninig");
})
server.get("/getdigimons", getDigimonsHandler);
server.post("/addtofav", addToFavHandler);
server.get("/getfavorite", getFavoriteHandler);
server.delete("/deletefavorite/:id", deleteFavHandler);
server.put("/updatefavorite/:id", updateFavoriteHandler);


function getDigimonsHandler(req, res) {
    axios.get("https://digimon-api.vercel.app/api/digimon").then(result => {
        const digimons = result.data.map(digimon => {
            return new Digimon(digimon);
        })
        res.send(digimons);
    })
    
}
function addToFavHandler(req, res) {
    const digimon= req.body;
    console.log(digimon);
    const dig = new digimonModel({
        name: digimon.name,
        img: digimon.img,
        level:digimon.level
    })
    dig.save();
   
}


function getFavoriteHandler(req, res) {
    digimonModel.find({}, (err, data) => {
        if (!err) {
            res.send(data);
        }
    })
}

function deleteFavHandler(req, res) {
    const id = req.params.id;
    digimonModel.remove({_id:id}, (err, result) => {
        digimonModel.find({}, (err, data) => {
            if (!err) {
                res.send(data);
            }
        })
    })
}

function updateFavoriteHandler(req, res) {
    const body = req.body;
    const id = req.params.id;
    digimonModel.findOne({_id:id}, (err, data) => {
        data.name = body.name;
        data.img = body.img;
        data.level = body.level;
        data.save().then(() => {
            digimonModel.find({}, (err, result) => {
                if (!err) {
                    res.send(result);
                }
            })
        })
    })

}

class Digimon{
    constructor(digimon) {
        this.name = digimon.name;
        this.img = digimon.img;
        this.level = digimon.level;
    }
}