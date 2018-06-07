
module.exports = {
  
    getXNamePagination: async function (req, res) {
        try{
            
            let fisher = await FishType.findOne({ name: req.params.name })
            let fishers = await Fish.find({ type : fisher.id }).populate('type').populate("store").paginate({page: req.params.page, limit: req.params.limit});

            res.json(fishers);
        }
        catch(e){
            res.serverError(e);
        }
    }
};

