const musicModel = require('../models/music.model')
const userModel = require('../models/user.model')
const uploadFile = require('../services/storage.service')
const albumModel = require('../models/album.model')
const jwt = require('jsonwebtoken')

async function createMusic(req, res) {

    try {
        const token = req.cookies.token
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)


        // }catch(err){
        //     return res.status(401).json({message: "Unauthorized" , error: err.message})
        // }


        const { title } = req.body
        const file = req.file

        if (!file) {
            return res.status(400).json({ message: "Music file is required" });
        }

        const result = await uploadFile(file.buffer.toString('base64'))

        const music = await musicModel.create({
            uri: result.url,
            title,
            artist: decoded.id
        })
        res.status(201).json({
            message: "Song Created Successfully ",
            music: {
                id: music._id,
                title: music.title,
                artist: music.artist,
                uri: music.uri
            }
        })


    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Error creating song",
            error: err.message
        })
    }

}


async function createAlbum(req, res) {
    const token = req.cookies.token

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" })

    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const { title, musics } = req.body
        const album = await albumModel.create({
            title,
            artist: decoded.id,
            music: musics
        })
        res.status(201).json({
            message: "Album Created Successfully",
            album: {
                id: album._id,
                title: album.title,
                artist: album.artist,
                music: album.musics
            }
        })

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Error creating album",
            error: err.message
        })
    }

}


async function getAllSongs(req, res) {
    try {
        const songs = await musicModel.find().populate('artist', 'username')

        res.status(200).json({
            message: "All Songs Fetched Successfully",
            songs: songs,
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Error fetching songs",
            error: err.message
        })
    }
}

async function getAllAlbum(req, res) {

    const albums = await albumModel.find().populate('artist', 'username')
    res.status(200).json({
        message: "All Albums Fetched Successfully",
        albums: albums
    })

}

async function getAlbumById(req, res) {
    const { id } = req.params
    const album = await albumModel.findById(id).populate('artist', 'username').populate('music', '_id uri title artist')
    res.status(200).json({
        message: "Album Fetched Successfully",
        album: album
    })
}
async function addSongPlaylist(req, res) {
    const { id } = req.params
    const { music } = req.body
    const album = await albumModel.findById(id)
    album.music.push(music)
    await album.save()
    res.status(200).json({
        message: "Song Added Successfully",
        album: album
    })

}

module.exports = { createMusic, createAlbum, getAllSongs, getAllAlbum, getAlbumById, addSongPlaylist }