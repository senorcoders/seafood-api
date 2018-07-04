const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const IMAGES = path.resolve(__dirname, '../../images/');
const rimraf = require("rimraf");

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

        let dirname = IMAGES + "/" + req.params.id;
        //create directory if not exists
        if (!fs.existsSync(dirname)) {
            fs.mkdirSync(dirname);
        }

        let images = [], i = 0;
        ////console.log(req);
        req.file("images").upload({
            dirname,
            maxBytes: 20000000,
            saveAs: function (stream, cb) {
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
                        src: "/api/images" + "/" + file.filename + "/" + req.params.id
                    });
                }
            }

            if (fish.hasOwnProperty("images") && Object.prototype.toString.call(fish.images) === "[object Array]") {
                for (let dir of dirs) {
                    if (fish.images.findIndex(function (i) { return i.src === dir.src || i.filename === dir.filename }) === -1) {
                        fish.images.push(dir);
                    }
                }
            } else {
                fish.images = dirs;
            }

            let upda = await Fish.update({ id: fish.id }, { images: fish.images });
            ////console.log(upda);

            return res.json(fish.images);
        })
    },

    getImage: async function (req, res) {

        try {
            let id = req.param("id"), namefile = req.param("namefile");

            let directory = IMAGES + `${"/" + id + "/" + namefile}`;
            console.log(directory);

            if (!fs.existsSync(directory)) {
                throw new Error("file not exist");
            }

            // read binary data
            var data = fs.readFileSync(directory);

            // convert binary data to base64 encoded string
            let content = 'image/' + namefile.split(".").pop();
            res.contentType(content);
            res.send(data);

        }
        catch (e) {
            //console.log(e);
            res.serverError(e);
        }

    },

    deleteImage: async function (req, res) {
        try {
            let id = req.param("id"), namefile = req.param("namefile");

            let directory = IMAGES + `${"/" + id + "/" + namefile}`;
            //console.log(directory);

            let fish = await Fish.findOne({ id });
            if (fish === undefined) {
                return res.serverError("id not found");
            }

            if (fish.hasOwnProperty("images") && Object.prototype.toString.call(fish.images) === "[object Array]") {
                let index = fish.images.findIndex(function (i) { return i.filename === namefile })
                if (index !== -1) {
                    if (fish.images.length === 1) {
                        fish.images = [];
                    } else if (fish.images.length > 1) {
                        fish.images.splice(index, 1);
                    }
                }
            }

            let upda = await Fish.update({ id: fish.id }, { images: fish.images });
            //console.log(upda);

            if (!fs.existsSync(directory)) {
                throw new Error("file not exist");
            }

            // read binary data
            var data = fs.unlinkSync(directory);

            res.json({ msg: "success" })

        }
        catch (e) {
            //console.log(e);
            res.serverError(e);
        }
    },

    saveLogoStore: async (req, res) => {
        let idStore = "";
        if (Object.prototype.toString.call(res) === "[object String]") {
            idStore = res;
            res = false;
        } else {
            idStore = req.param("id");
        }

        return new Promise((resolve, reject) => {
            try {
                let dirname = path.join(IMAGES, "/store/", idStore);

                //create directory if not exists
                if (!fs.existsSync(dirname)) {
                    fs.mkdirSync(dirname);
                }

                dirname = path.join(dirname, "/logo");
                if (!fs.existsSync(dirname)) {
                    fs.mkdirSync(dirname);
                }

                req.file("logo").upload({
                    dirname,
                    maxBytes: 5000000,
                    saveAs: function (stream, cb) {
                        //console.log(stream);
                        cb(null, stream.filename);
                    }
                }, async function (err, uploadedFiles) {
                    if (err) {
                        reject(err);
                        if (res !== false) {
                            res.serverError(err);
                        }
                    }

                    let dir = "";
                    for (let file of uploadedFiles) {
                        if (file.type.includes("image/") && file["status"] === "finished") {
                            dir = "/api/store/images/logo/" + file.filename + "/" + idStore
                        }
                    }

                    let upda = await Store.update({ id: idStore }, { logo: dir }).fetch();

                    resolve(upda);
                    if (res !== false) {
                        res.json(upda);
                    }
                })
            }
            catch (e) {
                console.error(e);
                reject(e);
                if (res !== false) {
                    res.serverError(e);
                }
            }
        });
    },

    saveHeroStore: async (req, res) => {
        let idStore = "";
        if (Object.prototype.toString.call(res) === "[object String]") {
            idStore = res;
            res = false;
        } else {
            idStore = req.param("id");
        }

        return new Promise((resolve, reject) => {
            try {
                let dirname = path.join(IMAGES, "/store/", idStore);

                //create directory if not exists
                if (!fs.existsSync(dirname)) {
                    fs.mkdirSync(dirname);
                }

                dirname = path.join(dirname, "/hero")
                if (!fs.existsSync(dirname)) {
                    fs.mkdirSync(dirname);
                }

                req.file("hero").upload({
                    dirname,
                    maxBytes: 5000000,
                    saveAs: function (stream, cb) {
                        //console.log(stream);
                        cb(null, stream.filename);
                    }
                }, async function (err, uploadedFiles) {
                    if (err) {
                        reject(err);
                        if (res !== false) {
                            res.serverError(err);
                        }
                    }

                    let dir = "";
                    for (let file of uploadedFiles) {
                        if (file.type.includes("image/") && file["status"] === "finished") {
                            dir = "/api/store/images/hero/" + file.filename + "/" + idStore;
                        }
                    }

                    let upda = await Store.update({ id: idStore }, { heroImage: dir }).fetch();

                    resolve();
                    if (res !== false) {
                        res.json(upda);
                    }
                })
            }
            catch (e) {
                console.error(e);
                reject(e);
                if (res !== false) {
                    res.serverError(e);
                }
            }
        });
    },

    saveImagesStore: async (req, res) => {
        let idStore = "";
        if (Object.prototype.toString.call(res) === "[object String]") {
            idStore = res;
            res = false;
        } else {
            idStore = req.param("id");
        }

        return new Promise(async (resolve, reject) => {
            try {

                let dirname = path.join(IMAGES, "/store/", idStore);
                let store = await Store.findOne({ id: idStore });
                console.log(store);

                //create directory if not exists
                if (!fs.existsSync(dirname)) {
                    fs.mkdirSync(dirname);
                }

                req.file("images").upload({
                    dirname,
                    maxBytes: 5000000,
                    saveAs: function (stream, cb) {
                        ////console.log(stream);
                        cb(null, stream.filename);
                    }
                }, async function (err, uploadedFiles) {
                    if (err) {
                        reject(err);
                        if (res !== false) {
                            res.serverError(err);
                        }
                    }

                    let dirs = [];
                    for (let file of uploadedFiles) {
                        if (file.type.includes("image/") && file["status"] === "finished") {
                            dirs.push({
                                filename: file.filename,
                                src: "/api/store/images/" + file.filename + "/" + req.params.id
                            });
                        }
                    }

                    if (store.hasOwnProperty("galeryImages") && Object.prototype.toString.call(store.galeryImages) === "[object Array]") {
                        for (let dir of dirs) {
                            if (store.galeryImages.findIndex(function (i) { return i.src === dir.src }) === -1) {
                                store.galeryImages.push(dir);
                            }
                        }
                    } else {
                        store.galeryImages = dirs;
                    }

                    let upda = await Store.update({ id: idStore }, { galeryImages: store.galeryImages }).fetch();

                    resolve(store);
                    if (res !== false) {
                        res.json(upda);
                    }
                })
            }
            catch (e) {
                console.error(e);
                reject(e);
                if (res !== false) {
                    res.serverError(e);
                }
            }
        });
    },

    getLogoAndHeroStore: async (req, res) => {
        try {
            let dirname = path.join(IMAGES, "store", req.param("id"), req.param("main"), req.param("namefile"));
            console.log(dirname);
            if (!fs.existsSync(dirname)) {
                throw new Error("file not exist");
            }

            // read binary data
            var data = fs.readFileSync(dirname);

            // convert binary data to base64 encoded string
            let content = 'image/' + req.param("namefile").split(".").pop();
            res.contentType(content);
            res.send(data);
        }
        catch (e) {
            console.error(e);
            res.serverError(e);
        }

    },

    getImagesStore: async (req, res) => {
        try {
            let dirname = path.join(IMAGES, "store", req.param("id"), req.param("namefile"));
            console.log(dirname);
            if (!fs.existsSync(dirname)) {
                throw new Error("file not exist");
            }

            // read binary data
            var data = fs.readFileSync(dirname);

            // convert binary data to base64 encoded string
            let content = 'image/' + req.param("namefile").split(".").pop();
            res.contentType(content);
            res.send(data);
        }
        catch (e) {
            console.error(e);
            res.serverError(e);
        }
    },

    multipleImagesCategory: async function (req, res) {

        id = req.param("id");
        let type = await FishType.findOne({ id });
        if (type === undefined) {
            return res.serverError("id not found");
        }

        let dirname = path.join(IMAGES, "category", id);

        //create directory if not exists
        if (!fs.existsSync(dirname)) {
            fs.mkdirSync(dirname);
        }

        let images = [];
        ////console.log(req);
        req.file("images").upload({
            dirname,
            maxBytes: 20000000,
            saveAs: function (stream, cb) {
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
                        src: "/api/images/category/" + file.filename + "/" + req.params.id
                    });
                }
            }

            if (type.hasOwnProperty("images") && Object.prototype.toString.call(type.images) === "[object Array]") {
                for (let dir of dirs) {
                    if (type.images.findIndex(function (i) { return i.src === dir.src || i.filename === dir.filename }) === -1) {
                        type.images.push(dir);
                    }
                }
            } else {
                type.images = dirs;
            }

            let upda = await FishType.update({ id }, { images: type.images });
            ////console.log(upda);

            return res.json(type.images);
        });
    },

    getImagesCategory: async (req, res) => {
        try {
            let dirname = path.join(IMAGES, "category", req.param("id"), req.param("namefile"));
            console.log(dirname);
            if (!fs.existsSync(dirname)) {
                throw new Error("file not exist");
            }

            // read binary data
            var data = fs.readFileSync(dirname);

            // convert binary data to base64 encoded string
            let content = 'image/' + req.param("namefile").split(".").pop();
            res.contentType(content);
            res.send(data);
        }
        catch (e) {
            console.error(e);
            res.serverError(e);
        }

    },

    saveImageLicence: async (req, res) => {
        id = req.param("id");
        let user = await User.findOne({ id });
        if (user === undefined) {
            return res.serverError("id not found");
        }

        let dirname = path.join(IMAGES, "license", id);

        //create directory if not exists
        if (!fs.existsSync(dirname)) {
            fs.mkdirSync(dirname);
        }

        ////console.log(req);
        req.file("license").upload({
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
                if (file.type.includes("image/") && file["status"] === "finished") {
                    dir = "/api/images/license/" + file.filename + "/" + id;
                }
            }

            if (user.hasOwnProperty("dataExtra") && Object.prototype.toString.call(user.dataExtra) === "[object Object]") {
                user.dataExtra.uploadTradeLicense = dir;
            } else {
                user.dataExtra = {
                    uploadTradeLicense: dir
                };
            }

            let upda = await User.update({ id }, { dataExtra: user.dataExtra }).fetch();
            ////console.log(upda);

            return res.json(upda);
        });
    },

    getImagesLicense: async (req, res) => {
        try {
            let dirname = path.join(IMAGES, "license", req.param("id"), req.param("namefile"));
            console.log(dirname);
            if (!fs.existsSync(dirname)) {
                throw new Error("file not exist");
            }

            // read binary data
            var data = fs.readFileSync(dirname);

            // convert binary data to base64 encoded string
            let content = 'image/' + req.param("namefile").split(".").pop();
            res.contentType(content);
            res.send(data);
        }
        catch (e) {
            console.error(e);
            res.serverError(e);
        }

    },

    deleteImageCategory: async function (req, res) {
        try {
            let id = req.param("id"), namefile = req.param("namefile");

            let directory = path.join(IMAGES, "category", id, namefile);
            //console.log(directory);

            let type = await FishType.findOne({ id });
            if (type === undefined) {
                return res.serverError("id not found");
            }

            //console.log(upda);

            if (!fs.existsSync(directory)) {
                throw new Error("file not exist");
            }

            if (type.hasOwnProperty("images") && Object.prototype.toString.call(type.images) === "[object Array]") {
                let index = type.images.findIndex(function (i) { return i.filename === namefile })
                if (index !== -1) {
                    if (type.images.length === 1) {
                        type.images = [];
                    } else if (type.images.length > 1) {
                        type.images.splice(index, 1);
                    }
                }
            }

            let upda = await FishType.update({ id: type.id }, { images: type.images }).fetch();

            // read binary data
            var data = fs.unlinkSync(directory);

            res.json(upda);

        }
        catch (e) {
            //console.log(e);
            res.serverError(e);
        }
    },

    setPrimaryImage: async function (req, res) {

        try {
            let src = req.param("src"), id = req.param("id");

            let fish = await Fish.findOne({ id });
            if (fish === undefined) {
                return res.status(400).send("fish not found!");
            }


            let dirname = path.join(IMAGES, "primary", id);

            //create directory if not exists
            if (!fs.existsSync(dirname)) {
                fs.mkdirSync(dirname);
            }

            req.file("image")
                .upload({
                    dirname,
                    maxBytes: 5000000,
                    saveAs: function (stream, cb) {
                        //console.log(stream);
                        cb(null, stream.filename);
                    }
                }, async (err, uploadedFiles) => {

                    let valid = false;
                    for (let file of uploadedFiles) {
                        await Fish.update({ id }, { imagePrimary: "/api/images/primary/" + file.filename + "/" + id });
                        valid = true;
                    }

                    if (valid === false) {
                        return res.status(500).send("field image not found!");
                    }

                    res.json({ msg: "success" });
                })

        }
        catch (e) {
            console.error(e);
            res.serverError(e);
        }
    },

    getImagePrimary: async (req, res) => {
        try {
            let dirname = path.join(IMAGES, "primary", req.param("id"), req.param("namefile"));
            console.log(dirname);
            if (!fs.existsSync(dirname)) {
                throw new Error("file not exist");
            }

            // read binary data
            var data = fs.readFileSync(dirname);

            // convert binary data to base64 encoded string
            let content = 'image/' + req.param("namefile").split(".").pop();
            res.contentType(content);
            res.send(data);
        }
        catch (e) {
            console.error(e);
            res.serverError(e);
        }

    },

    updateImagePrimary: async (req, res) => {
        try {
            let id = req.param("id"), namefile = req.param("namefile");

            let fish = await Fish.findOne({ id });
            if (fish === undefined) {
                return res.status(400).send("fish not found!");
            }

            await Fish.update({ id }, { imagePrimary: "" });

            let dirname = path.join(IMAGES, "primary", id);

            //create directory if not exists
            if (!fs.existsSync(dirname)) {
                fs.mkdirSync(dirname);
            }

            let directory = path.join(IMAGES, "primary", id, namefile);

            // read binary data
            if (fs.existsSync(directory)) {
                fs.unlinkSync(directory);
            }

            req.file("image")
                .upload({
                    dirname,
                    maxBytes: 5000000,
                    saveAs: function (stream, cb) {
                        //console.log(stream);
                        cb(null, stream.filename);
                    }
                }, async (err, uploadedFiles) => {
                    if (err) { return res.serverError(err); }

                    for (let file of uploadedFiles) {
                        await Fish.update({ id }, { imagePrimary: "/api/images/primary/" + file.filename + "/" + id });
                    }

                    res.json({ msg: "success" });
                })
        }
        catch (e) {
            console.error(e);
            res.serverError(e);
        }
    },

    deleteImageXDirName: (dirs) => {
        return new Promise((resolve, reject) => {

            let dirname = IMAGES;
            for (let arg of dirs) {
                if (Object.prototype.toString.call(arg) === '[object String]') {
                    dirname = path.join(dirname, arg);
                }
            }

            console.log(dirname);
            if (fs.existsSync(dirname) === true) {
                console.log(true);
                rimraf(dirname, (er)=>{
                    if(er){ return reject(er); }

                    resolve();
                });
            }

        })
    },

    saveImageTrackingFile: async (req, res) => {
        id = req.param("id");
        let item = await ItemShopping.findOne({ id });
        if (item === undefined) {
            return res.serverError("id not found");
        }

        let dirname = path.join(IMAGES, "trackingfile", id);

        //create directory if not exists
        if (!fs.existsSync(dirname)) {
            fs.mkdirSync(dirname);
        }

        ////console.log(req);
        req.file("file").upload({
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
                    dir = "/api/images/trackingfile/" + file.filename + "/" + id;
                }
            }

            item.trackingFile = dir;

            let upda = await ItemShopping.update({ id }, { trackingFile: item.trackingFile }).fetch();
            ////console.log(upda);

            return res.json(upda);
        });
    },

    getTrackingFile: async (req, res) => {
        try {
            let dirname = path.join(IMAGES, "trackingfile", req.param("id"), req.param("namefile"));
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
                    if (err){ return reject(err); };
                    console.log(result);
                    resolve(result);
                });
            });

            // convert binary data to base64 encoded string
            res.contentType(mimeType)
            res.send(data);
        }
        catch (e) {
            console.error(e);
            res.serverError(e);
        }

    },
}

