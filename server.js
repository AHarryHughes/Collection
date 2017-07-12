const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('mongodb');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var Album = require('./models/Albums');
const mustache = require('mustache-express');
// Replace "test" with your database name.
mongoose.connect('mongodb://localhost:27017/Albums');
mongoose.connection
    .once('open', () => console.log('good to go'))
    .on('error', (error) => {
      console.warn('Warning', error);
    });


const application = express();

application.use('/static', express.static('static'));

application.engine('mustache', mustache());

application.set('views', './views');
application.set('view engine', 'mustache');

application.use('/assets', express.static('./assets'));
application.use(bodyParser.urlencoded({ extended: true }));


var tmp_album = {};


application.get('/', async function (request, response) {
    var model = await Album.find();
    response.render('index', {model: model});
});

application.post('/', async function (request, response) {
    console.log(request.body.title);
    var nuAlbum = new Album(
        {title: request.body.title || "-",
        artist: request.body.artist || "-",
        rating_out_of_ten: parseInt(request.body.rating_out_of_ten) || 0,
        favorite_tracks: [
            request.body.track_1 || "-",
            request.body.track_2 || "-",
            request.body.track_3 || "-",
            request.body.track_4 || "-",
            request.body.track_5 || "-"
        ]
    });
    nuAlbum.save()
      .then( async () => {
        var model = await Album.find();
        response.render('index', {model: model});
      });
});

application.get('/:title/:artist', async function (request, response) {
    console.log(request.params.title);
    var tmp_album = await Album.find({title: request.params.title});
    console.log(tmp_album[0].favorite_tracks[0]);
    response.render('edit_page', {tmp_album: tmp_album[0]});
});

application.post('/:title/:artist', async function (request, response) {
    Album.update(tmp_album,
                    {title: request.body.title,
                    artist: request.body.artist,
                    rating_out_of_ten: parseInt(request.body.rating_out_of_ten),
                    favorite_tracks: [
                        request.body.track_1,
                        request.body.track_2,
                        request.body.track_3,
                        request.body.track_4,
                        request.body.track_5
                    ]
                })
                    .then(() => {
                        console.log('edit_and_back_to_home');
                        response.redirect('/');
                    });
});

application.get('/:title', async function (request, response) {
    Album.remove({ title: request.params.title})
        .then( async () => {
            var model = await Album.find();
            console.log('delete');
            response.render('index', {model: model});
    });
});





application.listen(4000);
