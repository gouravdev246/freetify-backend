const ImageKit = require('@imagekit/nodejs')

const imageKitClinet = new ImageKit({
  publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
  privateKey: process.env.IMAGE_KIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGE_KIT_URL_ENDPOINT
});

async function uploadFile(file) {
  const result = await imageKitClinet.files.upload({
    file,
    fileName: "music_" + Date.now(),
    folder: 'spotify_music'


  })
  return result;

}
module.exports = uploadFile;