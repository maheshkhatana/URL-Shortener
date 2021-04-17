const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const dotenv = require("dotenv");
const dns = require('dns');
const shortid = require('shortid');

const URL = require('./models/url.js')


dotenv.config();

const app = express();

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });
mongoose.connection.on('connected', () => {
    console.log(`Connected to MongoDB successfully`)
})


// check if url is valid
// valid url   ->   check in DB   ->   if already exist  ->  return corresponding short url
// valid url   ->   not existing in DB  ->  generate a short url and store the url and short url
// invalid url   ->    return error
app.post('/api/shorturl/new', (req, res) => {
    const original_url = req.body.url;
    const tmp = original_url.replace(/^https?:\/\//, '');     // removing https:// as dns doesn't work on protocols

    dns.lookup(tmp, (err, address, family) => {
        if (err) {
            res.json({ "error": "invalid URL" })        // invalid URL
        } else {
            URL.findOne({ "original_url": original_url })
                .then((response) => {
                    if (response) {
                        // url already exists in DB
                        res.json({
                            "original_url": response.original_url,
                            "short_url": response.short_url
                        })
                    } else {
                        // url is not in DB
                        const urlObj = {
                            "original_url": original_url,
                            "short_url": shortid.generate().slice(0, 5)
                        }
                        const newURL = new URL(urlObj);
                        newURL.save()
                            .then(() => res.json(urlObj))
                            .catch(err => res.status(400).json('Error:' + err))

                    }
                })
                .catch(err => console.log('error is', err))
        }
    })
})

// check if short url exist in DB   ->    yes   ->    redirect to original url
// doesn't exist  ->  return error msg

app.get('/api/shorturl/:new', (req, res) => {
    const short_url = req.params.new;
    URL.findOne({ "short_url": short_url })
        .then((response) => {
            if (response) {
                // short url exist in DB
                res.redirect(response.original_url)
            } else {
                res.json({ "error": "No short url found for given input" })
            }
        })
})




app.use('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html')
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`App running on PORT ${PORT}`)
})
