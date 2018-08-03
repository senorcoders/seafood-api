
module.exports = {
  
    saveOrUpdate: async(req, res)=>{
        try{
            let featured = await FeaturedTypes.find().limit(1);
            if(featured.length===0){
                featured = await FeaturedTypes.create({featuredsID: req.param("featuredsID")}).fetch();
            }else{
                featured = featured[0];
            }
            console.log(featured);

            //Cargamos los featured
            featured.featureds = await Promise.all(featured.featuredsID.map(async it=>{
                let fea = await FishType.findOne({id:it});
                return fea;
            }));

            res.json(featured);
        }   
        catch(e){
            console.error(e);
            res.serverError(e);
        }
    },

    get: async(req, res)=>{
        try{
            let featured = await FeaturedTypes.find().limit(1);
            if(featured.length===0){
                return res.json({msg: "not added featured types"});
            }else{
                featured = featured[0];
            }

            //Cargamos los featured
            featured.featureds = await Promise.all(featured.featuredsID.map(async it=>{
                let fea = await FishType.findOne({id:it});
                return fea;
            }));

            res.json(featured);
        }   
        catch(e){
            console.error(e);
            res.serverError(e);
        }
    }
};

