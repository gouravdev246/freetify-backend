const express = require('express')
const router = express.Router()
const multer = require('multer')

const musicController = require('../controllers/music.controller')
const upload = multer({
    storage : multer.memoryStorage()
})
router.post('/upload' , upload.single('music') , musicController.createMusic)
router.post('/create-album' , musicController.createAlbum)
router.get('/songs' , musicController.getAllSongs)
router.get('/albums' , musicController.getAllAlbum)
router.get('/album/:id' , musicController.getAlbumById)
router.patch('/albumupdate/:id' , musicController.addSongPlaylist)

module.exports = router