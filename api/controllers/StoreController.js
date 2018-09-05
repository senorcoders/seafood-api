const sharp = require('sharp');
const fs = require("fs");
const path = require("path");
const mmm = require('mmmagic'),
    Magic = mmm.Magic;
const rimraf = require('rimraf');
const isWin = process.platform === "win32";
const DIR = path.join(__dirname, "../../images/store/sfs");


module.exports = {
    save: async (req, res) => {
        try {
            let imageCtrl = require("./ImageController");
            let owner = req.param("owner"), description = req.param("description"),
                location = req.param("location"), name = req.param("name");
            let store = await Store.create({ owner, description, location, name }).fetch();

            store = await imageCtrl.saveLogoStore(req, store.id);

            res.json(store);
        }
        catch (e) {
            console.error(e);
            res.serverError(e);
        }
    },

    getXUser: async (req, res) => {
        try {
            let id = req.param("id");
            let store = await Store.find().where({ owner: id });
            if (store === undefined) {
                return res.status(400).send('not found');
            }

            res.json(store);
        }
        catch (e) {
            console.error(e);
            res.serverError(e);
        }
    },

    getStoreSimplified: async (req, res) => {
        try {
            let stores = await Store.find();
            stores = stores.map(function (it) {
                return { id: it.id, name: it.name };
            });

            res.json(stores);
        }
        catch (e) {
            console.error(e);
            res.serverError(e);
        }
    },

    getWithTypes: async (req, res) => {
        try {
            let id = req.param("id");
            let store = await Store.findOne({ id });
            store.fishs = await Fish.find({ store: store.id }).populate("type")

            res.json(store);
        }
        catch (e) {
            console.error(e);
            res.serverError(e);
        }
    },

    uploadImagesSFS: async (req, res) => {
        try {
            let id = req.param("id");
            let store = await Store.findOne({ id });
            if (store === undefined) {
                return res.serverError("id not added");
            }

            let dirname = path.join(DIR, id);

            //Si no exite el path, se crea
            if (fs.existsSync(dirname) === false) {
                fs.mkdirSync(dirname)
            }

            // saveSFS_SalesOrderForm(req, res, dirname);

            req.file("sfs").upload({
                dirname,
                maxBytes: 20000000
            }, async function (err, uploadedFiles) {
                console.log("estas");
                if (err) return res.serverError(err);

                let srcs = {
                    SFS_SalesOrderForm: "",
                    SFS_TradeLicense: "",
                    SFS_ImportCode: "",
                    SFS_HSCode: ""
                };
                let i = 0;
                for (let file of uploadedFiles) {
                    if (file["status"] === "finished") {
                        let rs = path.resolve(file.fd);
                        console.log(rs);
                        let nameFile = isWin ? rs.split("\\").pop() : rs.split("/").pop();
                        if (i == 0) {
                            srcs.SFS_SalesOrderForm = "/image/store/sfs/" + nameFile + "/" + req.param("id");
                        }
                        if (i == 1) {
                            srcs.SFS_TradeLicense = "/image/store/sfs/" + nameFile + "/" + req.param("id");
                        }
                        if (i == 2) {
                            srcs.SFS_ImportCode = "/image/store/sfs/" + nameFile + "/" + req.param("id");
                        }
                        if (i == 3) {
                            srcs.SFS_HSCode = "/image/store/sfs/" + nameFile + "/" + req.param("id");
                        }
                        i++;
                    }
                }

                await Store.update({ id }, srcs);

                res.json({ msg: "success" });
            })

        }
        catch (e) {
            console.error(e);
            res.serverError(e);
        }
    },

    getImageSFS: async (req, res) => {
        try {
            let nameFile = req.param("namefile"), id = req.param("id"),
                dirname = path.join(DIR, id, nameFile);

            let mimeType = await new Promise(function (resolve, reject) {
                var magic = new Magic(mmm.MAGIC_MIME_TYPE);
                magic.detectFile(dirname, function (err, result) {
                    if (err) { return reject(err); };
                    resolve(result);
                });
            });

            if (fs.existsSync(dirname) === true) {
                let data = fs.readFileSync(dirname);
                res.contentType(mimeType);
                res.send(data);
            } else {
                res.serverError("not found");
            }

        }
        catch (e) {
            console.error(e);
            res.serverError(e);
        }
    },

    deleteImageSFS: async (req, res) => {
        try {
            let sfs = req.param("sfs"), id = req.param("id"); console.log(sfs);
            let d = `
            SFS_SalesOrderForm
            SFS_TradeLicense
            SFS_ImportCode
            SFS_HSCode
            `;
            let store = await Store.findOne({id});
            if(store===undefined){
                res.status(400);
                return res.send("not found!");
            }

            if(store[sfs]){
                let url = store[sfs];
                let urlsplit = url.split("/").slice(-2);
                let namefile = urlsplit[0];
                let dirname = path.join(DIR, id, namefile);
                if (fs.existsSync(dirname) === true) {
                    console.log(dirname);
                    fs.unlinkSync(dirname);
                }
                store[sfs] = "";
                delete store["id"];
                console.log(store);
                await Store.update({id},store)
            }

            res.json({msg:"success"})

        }
        catch (e) {
            console.error(e);
            res.serverError(e);
        }
    }

};

