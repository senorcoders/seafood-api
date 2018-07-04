const fs = require('fs');
const path = require('path');
const ADMIN = path.resolve(__dirname, '../../admin/');
var mmm = require('mmmagic'),
    Magic = mmm.Magic;

module.exports = {

    saveFiles: async (req, res) => {

        let storage = await FilesUploadAdmin.find().limit(1);

        if (storage.length === 0) {
            storage = await FilesUploadAdmin.create({ files: [] }).fetch();
        } else {
            storage = storage[0];
        }

        let dirname = ADMIN;

        //create directory if not exists
        if (!fs.existsSync(dirname)) {
            fs.mkdirSync(dirname);
        }

        req.file("files").upload({
            dirname,
            maxBytes: 5000000,
            saveAs: function (stream, cb) {
                //console.log(stream);
                cb(null, stream.filename);
            }
        }, async function (err, uploadedFiles) {
            if (err) return res.send(500, err);

            let dir = "";
            for (let file of uploadedFiles) {
                if (file["status"] === "finished") {
                    dir = "/api/admin/" + file.filename + "/files";

                    let index = storage.files.findIndex(function (it) {
                        return it === dir;
                    });
                    if (index === -1) {
                        storage.files.push(dir);
                    }
                }
            }

            await FilesUploadAdmin.update({ id: storage.id }, { files: storage.files });

            res.json(storage.files);
        });
    },

    getFile: async (req, res) => {
        try {
            let dirname = path.join(ADMIN, req.param("filename"));
            console.log(dirname);
            if (!fs.existsSync(dirname)) {
                throw new Error("file not exist");
            }

            // read binary data
            var data = fs.readFileSync(dirname);

            //get mime type file
            let mimeType = await new Promise(function (resolve, reject) {
                var magic = new Magic(mmm.MAGIC_MIME_TYPE);
                magic.detectFile(dirname, function (err, result) {
                    if (err) { return reject(err); };
                    console.log(result);
                    resolve(result);
                });
            });

            // convert binary data to base64 encoded string
            res.setHeader('Content-disposition', 'attachment; filename=' + dirname);
            res.contentType(mimeType)
            res.send(data);
        }
        catch (e) {
            console.error(e);
            res.serverError(e);
        }

    },

    deleteFile: async (req, res) => {
        try {
            let storage = await FilesUploadAdmin.find().limit(1);

            if (storage.length === 0) {
                return res.status(400).send("not found");
            }else{
                storage = storage[0];
            }

            let dirname = path.join(ADMIN, req.param("filename"));
            console.log(dirname);
            if (!fs.existsSync(dirname)) {
                throw new Error("file not exist");
            }

            let dir = "/api/admin/" + req.param("filename") + "/files";

            let index = storage.files.findIndex(function (it) {
                return it === dir;
            });
            if (index !== -1) {

                if (storage.files.length === 0) {
                    storage.files = [];
                } else {
                    storage.files.splice(index, 1);
                }
            }

            await FilesUploadAdmin.update({id: storage.id}, {files: storage.files});

            // read binary data
            fs.unlinkSync(dirname);


            res.json(storage.files);
        }
        catch (e) {
            console.error(e);
            res.serverError(e);
        }

    },

    getFiles: async function(req, res){
        try{
            let storage = await FilesUploadAdmin.find().limit(1);

            if (storage.length === 0) {
                return res.status(400).send("not found");
            }else{
                storage = storage[0];
            }

            res.json(storage.files);
        }
        catch(e){
            console.error(e);
            res.serverError(e);
        }
    }

};

