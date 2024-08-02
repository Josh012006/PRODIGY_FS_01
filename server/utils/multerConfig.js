const multer = require('multer');
const path = require('path');

const uploadDir = path.resolve(__dirname, '../../client/public/users');

// Configuration de stockage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir); // Dossier de stock  des images
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Nom du fichier avec extension
    }
});

const upload = multer({ 
    storage: storage
});

module.exports = upload;