const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const IMAGES = path.resolve(__dirname, '../../assets/images/');

const writeImage = async function (nameFile, directory, image) {
    return new Promise(function (resolve, reject) {

        fs.writeFile(path.join(directory, nameFile + '.jpg'), image, function (err) {

            if (err) {
                return reject(err);
            }

            resolve({ message: "success" });

        });

    });
}

const resizeSave = async function (nameFile, directory, image, size) {

    return new Promise(function (resolve, reject) {

        sharp(image).resize(size.width, size.height)
            .crop(sharp.strategy.entropy)
            .toBuffer(async function (err, data, info) {
                if (err) { return reject(err); }

                try {
                    let write = await writeImage(nameFile, directory, data);
                    resolve(directory, data, info, true);
                }
                catch (e) {
                    reject(e);
                }

            });

    });
}


module.exports = {

    imagesUpload: async function (req, res) {

        let base64 = req.body.image.replace(/^data:image\/jpeg;base64,/, '');
        base64 = base64.replace(/^data:image\/png;base64,/, '');
        let image = new Buffer(base64, 'base64');

        let directory = [];

        directory.push(path.resolve(__dirname, '../../assets/images/' + req.body.model));
        directory.push(path.resolve(__dirname, '../../assets/images/' + req.body.model + '/' + req.body.id));

        let nameFile = req.body.id;

        //create directory if not exists
        if (!fs.existsSync(directory[0])) {
            fs.mkdirSync(directory[0]);
        }

        if (!fs.existsSync(directory[1])) {
            fs.mkdirSync(directory[1]);
        }

        //Para imagenes de 250 x 200
        let m250x200 = await resizeSave(nameFile + '300x200', directory[1], image, { width: 300, height: 200 });

        //Para imagenes de 350 x 300
        let m450x350 = await resizeSave(nameFile + '400x300', directory[1], image, { width: 400, height: 300 });

        //Para imagenes de 450 x 350
        let m700x600 = await resizeSave(nameFile + '700x600', directory[1], image, { width: 700, height: 600 });


        //para original
        let original = await writeImage(nameFile, directory[1], image);

        res.json([m250x200, m450x350, m700x600, original]);

    },

    multipleImagesUpload: async function (req, res) {

        let fish = await Fish.findOne({ id: req.params.id });
        if (fish === undefined) {
            return res.serverError("id not found");
        }

        let dirname = IMAGES + "/"+ req.params.id;

        //create directory if not exists
        if (!fs.existsSync(dirname)) {
            fs.mkdirSync(dirname);
        }

        let images = [], i = 0;
        req.file("images").upload({
            dirname,
            maxBytes: 20000000,
            saveAs: function(stream, cb){
                //console.log(stream);
                cb(null, stream.filename);
            }
        }, async function (err, uploadedFiles) {
            if (err) return res.send(500, err);

            let dirs = [];
            for (let file of uploadedFiles) {
                if (file.type.includes("image/") && file["status"] === "finished") {
                    dirs.push({
                        filename: file.filename,
                        src: "images"+ "/"+ req.params.id + "/" + file.fd.split("\\").pop()
                    });
                }
            }

            if (fish.hasOwnProperty("images") && Object.prototype.toString.call(fish.images) === "[object Array]") {
                for(let dir of dirs){
                    if( fish.images.findIndex(function(i){ return i.src === dir.src }) === -1 ){
                        fish.images.push(dir);
                    }
                }
            } else {
                fish.images = dirs;
            }

            let upda = await Fish.update({ id: fish.id }, { images: fish.images });
            console.log(upda);

            return res.json(fish.images);
        })
    },

    deleteImage: async function (req, res) {
        try {
            let id = req.param("id"), namefile = req.param("namefile");

            let directory = IMAGES + `${"/" + id + "/" + namefile}`;
            console.log(directory);
            if (!fs.existsSync(directory)) {
                throw new Error("file not exist");
            }

            // read binary data
            var data = fs.unlinkSync(directory);

            res.ok();

        }
        catch (e) {
            console.log(e);
            res.serverError(e);
        }
    }

};

