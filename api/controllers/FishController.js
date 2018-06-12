const path = require("path"), fs = require("fs");
const IMAGES = path.resolve(__dirname, '../../images/');

module.exports = {

    getAllPagination: async function (req, res) {
        try {
            let productos = await Fish.find().populate("type").populate("store").paginate({ page: req.params.page, limit: req.params.limit });
            productos = await Promise.all(productos.map(async function (m) {
                if (m.store === null)
                    return m;
                m.store.owner = await User.findOne({ id: m.store.owner });

                return m;
            }));

            res.json(productos);
        }
        catch (e) {
            res.serverError(e);
        }
    },

    customWhere: async function (req, res) {
        try {

            var db = Fish.getDatastore().manager;

            // Now we can do anything we could do with a Mongo `db` instance:
            var fish = db.collection(Fish.tableName);

            if (req.params.hasOwnProperty("where"))
                where = JSON.parse(req.params.where);
            else
                res.json({ message: "where not correct" });

            let productos = await fish.find(where);

            res.json(productos);
        }
        catch (e) {
            res.serverError(e);
        }
    },

    search: async function (req, res) {
        try {

            var db = Fish.getDatastore().manager;

            // Now we can do anything we could do with a Mongo `db` instance:
            var fish = db.collection(Fish.tableName);
            console.log(req.param("search"));
            let productos = await new Promise((resolve, reject) => {
                fish.find({
                    $or:
                        [
                            { name: { '$regex': '^.*' + req.param("search") + '.*$', '$options': 'i' } },
                            { description: { '$regex': '^.*' + req.param("search") + '.*$', '$options': 'i' } }
                        ]
                })
                    .toArray(async (err, arr) => {
                        if (err) { return reject(err); }

                        arr = await Promise.all(arr.map(async function (it) {
                            if (it.store === null)
                                return it;

                            it.store = await Store.findOne({ id: it.store.toString() }).populate("owner");
                            return it;
                        }));

                        resolve(arr);
                    });
            });

            res.json(productos);

            /*let productos = await Fish.find({name: {contains: req.param("name") } }).populate("type");
            
            res.json(productos);*/
        }
        catch (e) {
            res.serverError(e);
        }
    },

    getXMultipleID: async function (req, res) {
        try {
            let ids = false;
            try {
                ids = JSON.parse(req.params.ids);
                if (Object.prototype.toString.call(ids) !== "[object Array]") {
                    throw new Error("ids not is Array");
                }
            }
            catch (e) {
                console.error(e);
            }

            if (ids === false)
                return res.json({ message: "ids not correct array" });

            let productos = [];
            for (let id of ids) {
                let prod = await Fish.findOne({ id: id }).populate("type");
                productos.push(prod);
            }

            res.json(productos);
        }
        catch (e) {
            res.serverError(e);
        }
    },

    delete: async (req, res) => {
        try {

            let id = req.param("id");
            if (id === "" || id === undefined)
                return res.status(500).send("not id");

            let fish = await Fish.findOne({ id });
            if (fish === undefined) {
                return res.status(400).send("fish not found!");
            }

            let namefile, dirname;
            if (fish.hasOwnProperty("imagePrimary") && fish.imagePrimary !== ""  && fish.imagePrimary !== null) {
                namefile = fish.imagePrimary.split("/");
                namefile = namefile[namefile.length - 2];
                console.log(IMAGES, fish.id, namefile);
                dirname = path.join(IMAGES, "primary", fish.id, namefile);
                console.log(dirname);
                if (fs.existsSync(dirname)) {
                    console.log("exits primary");
                    fs.unlinkSync(dirname);
                    //dirname = path.join(IMAGES, "primary", fish.id);
                    //fs.unlinkSync(dirname);
                }
            }

            if (fish.hasOwnProperty("images") && fish.iamges !== null && Object.prototype.toString.call(fish.images) === "[object Array]") {
                for (let file of fish.images) {

                    namefile = file.filename;
                    dirname = path.join(IMAGES, fish.id, namefile);
                    console.log(dirname);
                    if (fs.existsSync(dirname)) {
                        console.log("exists");
                        fs.unlinkSync(dirname);
                    }
                }

                //dirname = path.join(IMAGES, fish.id);
                //if (fs.existsSync(dirname)) {
                //    console.log("exists");
                //    fs.unlinkSync(dirname);
                //}
            }

            await Fish.destroy({ id });

            res.json(fish);

        }
        catch (e) {
            console.error(e);
            res.serverError(e);
        }
    }

};