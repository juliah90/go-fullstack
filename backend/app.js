const express = require('express');
const mongoose = require('mongoose');

const Thing = require('./models/thing');

const app = express();

mongoose.connect('mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/?retryWrites=true&w=majority')
    .then(() => {
        console.log('Successfully connected to mongodb atlas');
    })
    .catch((error) => {
        console.log('Unable to connect to mongodb atlas');
        console.error(error);
    })

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.post('/api/stuff', (req, res, next) => {
    const thing = new Thing({
        title: req.body.title,
        description: req.body.description,
        imageUrl: req.body.imageUrl,
        price: req.body.price,
        userId: req.body.userId
    });
    thing.save().then(
        () => {
            res.status(201).json({
                message: 'Post saved successfully!'
            });
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
});

app.get('/api/stuff', (req, res, next) => {
    Thing.find().then((things)=>{
        res.status(200).json(things);
    }
    ).catch((error)=>{
        res.status(400).json({
            error: error
        });
    });
});

module.exports = app;