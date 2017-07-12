const mongoose = require('mongoose');

const albumsSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true },
    artist: String,
    rating_out_of_ten: Number,
    favorite_tracks: [String]
})

const Album = mongoose.model('albums', albumsSchema);

module.exports = Album;