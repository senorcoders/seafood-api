const path = require("path"), fs = require("fs");
const IMAGES = path.resolve(__dirname, '../../images/');

module.exports = {

    getAllPagination: async function (req, res) {
        try {
            let start = Number(req.params.page);
            --start;
            let productos = await Fish.find().populate("type").populate("store").paginate({ page: start, limit: req.params.limit });
            productos = await Promise.all(productos.map(async function (m) {
                if (m.store === null)
                    return m;
                m.store.owner = await User.findOne({ id: m.store.owner });

                return m;
            }));

            let arr = await Fish.find(),
                page_size = Number(req.params.limit), pages = 0;
            console.log(arr.length, Number(arr.length / page_size));
            if (parseInt(arr.length / page_size, 10) < Number(arr.length / page_size)) {
                pages = parseInt(arr.length / page_size, 10) + 1;
            } else {
                pages = parseInt(arr.length / page_size, 10)
            }

            res.json({ productos, pagesNumber: pages });
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
            let pages;
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
                        if (arr.length > 0) {
                            let page_number = Number(req.param("page"));
                            let page_size = Number(req.param("limit"));
                            console.log(arr.length, Number(arr.length / page_size));
                            if (parseInt(arr.length / page_size, 10) < Number(arr.length / page_size)) {
                                pages = parseInt(arr.length / page_size, 10) + 1;
                            } else {
                                pages = parseInt(arr.length / page_size, 10)
                            }
                            --page_number; // because pages logically start with 1, but technically with 0
                            arr = arr.slice(page_number * page_size, (page_number + 1) * page_size);
                        }
                        resolve(arr);
                    });
            });

            res.json({ fish: productos, pagesCount: pages });

            /*let productos = await Fish.find({name: {contains: req.param("name") } }).populate("type");
            
            res.json(productos);*/
        }
        catch (e) {
            res.serverError(e);
        }
    },

    getSuggestions: async (req, res) => {
        try {

            let name = req.param("name");

            var db = Fish.getDatastore().manager;
            var fish = db.collection(Fish.tableName);

            console.log(req.param("search"));
            let fishs = await new Promise((resolve, reject) => {
                fish.find({ name: { '$regex': '^.*' + name + '.*$', '$options': 'i' } })
                    .toArray(async (err, arr) => {
                        if (err) { return reject(err); }

                        resolve(arr);
                    });
            });

            let countAndFish = [];
            fishs.map(function (it) {
                let index = countAndFish.findIndex((t) => { if (t.name === it.name) return true; else return false; });
                if (
                    index === -1
                ) {
                    let f = { name: it.name, id: it._id };
                    f.count = 1;
                    countAndFish.push(f);
                } else {
                    countAndFish[index].count += 1;
                }

                return null;
            });

            res.json(countAndFish);

        }
        catch (e) {
            console.error(e);
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
            if (fish.hasOwnProperty("imagePrimary") && fish.imagePrimary !== "" && fish.imagePrimary !== null) {
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
    },

    getXTypeWithDataEspecified: async (req, res) => {
        try {

            let type = req.param("type");

            //Para cagar los items de cada carrito cargado
            async function getItemsCart(shoppingCart) {
                let items = await ItemShopping.find({ shoppingCart: shoppingCart.id }).populate("fish");
                items = items.filter(function (it) {
                    return it.fish.type === type;
                });

                //Cargamos el comprador y la tienda
                items = items.map(function (it) {
                    return {
                        id: it.fish.id,
                        name: it.fish.name,
                        quantity: it.quantity
                    };
                });

                return items;
            }

            let itemsFish = [];
            let cartsPaid = await ShoppingCart.find({ status: "paid" }).populate("buyer");
            for (let cart of cartsPaid) {
                let its = await getItemsCart(cart);
                itemsFish = itemsFish.concat(its);
            }

            let itemsP = [];
            for (let it of itemsFish) {
                let index = itemsP.findIndex(function (ite) {
                    return ite.name === it.name;
                });

                if (index === -1) {
                    let parser = it;
                    parser.quantity = [it.quantity];
                    itemsP.push(parser);
                } else {

                    let find = false;
                    for (let i = 0; i < itemsP[index].quantity.length; i++) {
                        if (itemsP[index].quantity[i].type === it.quantity.type) {
                            find = true;
                            itemsP[index].quantity[i].value += it.quantity.value;
                            break;
                        }
                    }

                    if (find === false) {
                        itemsP[index].quantity.push(it.quantity);
                    }
                }
            }

            res.json(itemsP);

        }
        catch (e) {
            console.error(e);
            res.serverError(e);
        }
    },

    getWithDataEspecified: async (req, res) => {
        try {

            //Para cagar los items de cada carrito cargado
            async function getItemsCart(shoppingCart) {
                let items = await ItemShopping.find({ shoppingCart: shoppingCart.id }).populate("fish");

                //Cargamos el comprador y la tienda
                items = await Promise.all(items.map(async function (it) {

                    it.fish = await Fish.findOne({ id: it.fish.id }).populate("type");
                    return {
                        quantity: it.quantity,
                        type: it.fish.type
                    };
                }));

                return items;
            }

            let itemsFish = [];
            let cartsPaid = await ShoppingCart.find({ status: "paid" });
            for (let cart of cartsPaid) {
                let its = await getItemsCart(cart);
                itemsFish = itemsFish.concat(its);
            }

            let itemsP = [];
            for (let it of itemsFish) {
                let index = itemsP.findIndex(function (ite) {
                    return ite.type.id === it.type.id;
                });

                if (index === -1) {
                    let parser = it;
                    parser.quantity = [it.quantity];
                    itemsP.push(parser);
                } else {

                    let find = false;
                    for (let i = 0; i < itemsP[index].quantity.length; i++) {
                        if (itemsP[index].quantity[i].type === it.quantity.type) {
                            find = true;
                            itemsP[index].quantity[i].value += it.quantity.value;
                            break;
                        }
                    }

                    if (find === false) {
                        itemsP[index].quantity.push(it.quantity);
                    }
                }
            }

            res.json(itemsP);

        }
        catch (e) {
            console.error(e);
            res.serverError(e);
        }
    },

    saveMulti: async (req, res) => {
        try {
            let products = req.body.products;
            for (let pro of products) {
                await Fish.create(pro);
            }

            res.json({ msg: "success" })
        }
        catch (e) {
            console.error(e);
            res.serverError(e);
        }
    },

    searchAvanced: async (req, res) => {
        try {

            let params = `
            name,
            country,
            fishType,
            raised,
            preparation,
            treatment`;

            let par = {};
            for (let p of await sails.helpers.parserNameParams(params)) {
                if (req.param(p) !== undefined) {
                    if ("fishType" === p) {
                        par["type"] = req.param(p);
                    } else
                        par[p] = { "contains": req.param(p) };
                }
            }
            console.log(par);

            let start = Number(req.params.page), page_size = Number(req.params.limit)
            --start;
            if (start < 0) start = 0;
            let productos = await Fish.find(par).populate("type").populate("store").paginate(start, page_size);

            let arr = productos, pages = 0;
            console.log(arr.length, Number(arr.length / page_size));
            if (parseInt(arr.length / page_size, 10) < Number(arr.length / page_size)) {
                pages = parseInt(arr.length / page_size, 10) + 1;
            } else {
                pages = parseInt(arr.length / page_size, 10)
            }

            res.json({ productos, pagesNumber: pages });

        }
        catch (e) {
            console.error(e);
            res.serverError(e);
        }
    }
};