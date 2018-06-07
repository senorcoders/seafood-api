

module.exports = {

    getAllPagination: async function (req, res) {
        try {
            let productos = await Fish.find().populate("type").populate("store").paginate({ page: req.params.page, limit: req.params.limit });
            productos = await Promise.all(productos.map(async function(m){
                if(m.store === null)
                    return m;
                m.store.owner = await User.findOne({id: m.store.owner});

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
            let productos = await new Promise((resolve, reject)=>{
                fish.find({ $or : 
                    [
                        { name:{'$regex' : '^.*' + req.param("search")+ '.*$', '$options' : 'i'} },
                        { description:{'$regex' : '^.*' + req.param("search")+ '.*$', '$options' : 'i'} }
                    ]  })
                .toArray(async (err, arr)=>{
                    if(err){ return reject(err); }

                    arr = await Promise.all(arr.map(async function(it){
                        if(it.store === null)
                            return it;
                        
                        it.store = await Store.findOne({id: it.store.toString() }).populate("owner");
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
    }

};