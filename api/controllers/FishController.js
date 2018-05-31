

module.exports = {

    getAllPagination: async function (req, res) {
        try {
            let productos = await Fish.find().populate("type").paginate({ page: req.params.page, limit: req.params.limit });
            res.json(productos);
        }
        catch (e) {
            res.serverError(e);
        }
    },

    customWhere: async function (req, res) {
        console.log(req.params.where);
        try {
            let where = false;
            try {
                if (req.params.hasOwnProperty("where"))
                    where = JSON.parse(req.params.where);
            }
            catch (e) {
                console.error(e);
            }

            if (where === false)
                return res.json({ message: "where not correct" });

            let productos = await Fish.find(where).populate("type");
            res.json(productos);
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