
module.exports = {
  
    getXNamePagination: async function (req, res) {
        try{
            
            let fisher = await FishType.findOne({ name: req.params.name })
            let fishers = await Fish.find({ type : fisher.id }).populate('type').populate("store").paginate({page: req.params.page, limit: req.params.limit});

            fishers = await Promise.all(fishers.map(async function(m){
                if(m.store === null)
                    return m;
                    
                m.store.owner = await User.findOne({id: m.store.owner});

                return m;
            }));

            res.json(fishers);
        }
        catch(e){
            res.serverError(e);
        }
    }
};

