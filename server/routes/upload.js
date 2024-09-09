const router = require('express').Router();
const cloudinary = require('cloudinary').v2;
const auth = require('../middleware/auth');
const authAdmin = require('../middleware/authAdmin');
const fs = require('fs');
const path = require('path');
const fileUpload = require('express-fileupload');

router.use(fileUpload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname, 'tmp/')
}));

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

router.post('/upload', auth, authAdmin, (req, res) => {
    try {
        console.log(req.files);

        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).send({ msg: "No file were uploaded" });
        }

        const file = req.files.file;
        if (!file) {
            return res.status(400).json({ msg: "No file were uploaded" });
        }

        if (file.size > 1024 * 1024) {
            removeTmp(file.tempFilePath);
            return res.status(400).json({ msg: "Size too large" });
        }

        if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png') {
            removeTmp(file.tempFilePath);
            return res.status(400).json({ msg: "File format is incorrect" });
        }

        const normalizedPath = path.normalize(file.tempFilePath);

        cloudinary.uploader.upload(normalizedPath, { folder: 'test' }, async (err, result) => {
            if (err) throw err;

            removeTmp(normalizedPath);

            res.json({ public_id: result.public_id, url: result.secure_url });
        });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
});

router.post('/destroy', auth, authAdmin, (req, res) => {
    try {
        const { public_id } = req.body;
        if (!public_id) return res.status(400).json({ msg: "No images Selected" });

        cloudinary.uploader.destroy(public_id, async (err, result) => {
            if (err) throw err;

            res.json({ msg: "Deleted" });
        });
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
});

const removeTmp = (path) => {
    fs.unlink(path, err => {
        if (err) throw err;
    });
}

module.exports = router;
