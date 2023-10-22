const path = require('path')
const multer = require('multer')
const uuidv4 = require('uuid').v4


const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'uploads/')
    },
    filename: function(req, file, cb){
        const ext = path.extname(file.originalname)
        cb(null, uuidv4() + ext)
    }
})

const upload = multer ({
    storage: storage,
    fileFilter: function(req, file, cb){
        if(
            file.mimetype =="image/png" ||
            file.mimetype =="image/jpg" ||
            file.mimetype =="image/jpeg" 
        ){
            cb(null, true);
        }
        else{
            console.log('file format is not supported');
            cb(null, false);
        }
    },
})

module.exports = upload