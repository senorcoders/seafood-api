
module.exports = {
  
    getXName: async function (req, res) {
        try{

            let fisher = await FishType.findOne({ name: req.params.name })
            let fishers = await Fish.find({ type : fisher.id }).populate('type')

            res.json(fishers);
        }
        catch(e){
            res.serverError(e);
        }
    }
};

