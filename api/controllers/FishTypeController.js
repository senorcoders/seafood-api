
module.exports = {

    getXNamePagination: async function (req, res) {
        try {

            let fisher = await FishType.findOne({ name: req.params.name });
            if (fisher === undefined) {
                return res.json({ fish: [], pagesNumber: 0 });
            }
            let page = req.params.page;
            --page; //Para que empieze desde 1
            let fishers = await Fish.find({ type: fisher.id }).populate('type').populate("store").paginate({ page, limit: req.params.limit });

            //Para calcular la cantidad de paginas
            let arr = await Fish.find({ type: fisher.id }),
                page_size = Number(req.params.limit), pages = 0;
            console.log(arr.length, Number(arr.length / page_size));
            if (parseInt(arr.length / page_size, 10) < Number(arr.length / page_size)) {
                pages = parseInt(arr.length / page_size, 10) + 1;
            } else {
                pages = parseInt(arr.length / page_size, 10)
            }

            fishers = await Promise.all(fishers.map(async function (m) {
                if (m.store === null)
                    return m;

                m.store.owner = await User.findOne({ id: m.store.owner });

                return m;
            }));

            res.json({ fish: fishers, pagesNumber: pages });
        }
        catch (e) {
            res.serverError(e);
        }
    },
    getParentTypes :  async ( req, res ) => {
        try {            
            let childs = await ParentType.find()
            .then(function ( result ) {
                return result.map( value => {
                    return value.child;
                } )
            })
            .catch(function (error) {
                console.log(error);
                return res.serverError(error);
            })

            let cats = await FishType.find({
                where: { id: { '!': childs } },
                sort: 'name ASC'
            })


             res.status(200).json( cats );
        } catch (error) {
            console.log(error);
            res.serverError(error);
        }
    },
    getParentChildTypes: async ( req, res ) => {
        try {            
            let parent_id = req.param('parent_id');
            
            let childs = await ParentType.find({
                where: { parent: parent_id }
            })
            .then(function ( result ) {
                return result.map( value => {
                    return value.child;
                } )
            })
            .catch(function (error) {
                console.log(error);
                return res.serverError(error);
            })
            

            let cats = await FishType.find({
                where: { id: childs  },
                sort: 'name ASC'
            })


             res.status(200).json( cats );
        } catch (error) {
            console.log(error);
            res.serverError(error);
        }
    },
    getChildTypes: async ( req, res ) => {
        try {                        
            let childs = await ParentType.find()
            .then(function ( result ) {
                return result.map( value => {
                    return value.child;
                } )
            })
            .catch(function (error) {
                console.log(error);
                return res.serverError(error);
            })
            

            let cats = await FishType.find({
                where: { id: childs  },
                sort: 'name ASC'
            })


             res.status(200).json( cats );
        } catch (error) {
            console.log(error);
            res.serverError(error);
        }
    }
};

