

module.exports = {
  
    saveOrUpdate: async(req, res)=>{
        try{

            let featured = await FishTypeMenu.find().limit(1);
            if(featured.length===0){
                featured = await FishTypeMenu.create({featuredsID: req.param("featuredsID")}).fetch();
            }else{
                featured = await FishTypeMenu.update({id: featured[0].id}, {featuredsID: req.param("featuredsID")}).fetch();
                featured = featured[0];
            }
            console.log(featured);

            //Cargamos los featured
            featured.featureds = await Promise.all(featured.featuredsID.map(async it=>{
                let type = await FishType.findOne({id:it}).populate("childsTypes").populate("parentsTypes");
                //Para cargar los child types
                type.childsTypes = await Promise.all(type.childsTypes.map(async it=>{
                    it.child = await FishType.findOne({id:it.child});
                    it.parent = await FishType.findOne({id:it.parent});

                    return it;
                }));

                //Para cargar los parents
                type.parentsTypes = await Promise.all(type.parentsTypes.map(async it=>{
                    it.child = await FishType.findOne({id:it.child});
                    it.parent = await FishType.findOne({id:it.parent});

                    return it;
                }));

                return type;
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
            let featured = await FishTypeMenu.find().limit(1);
            if(featured.length===0){
                return res.json({msg: "not added featured types"});
            }else{
                featured = featured[0];
            }

            //Cargamos los featured
            featured.featureds = await Promise.all(featured.featuredsID.map(async it=>{
                let type = await FishType.findOne({id:it}).populate("childsTypes").populate("parentsTypes");
                //Para cargar los child types
                type.childsTypes = await Promise.all(type.childsTypes.map(async it=>{
                    it.child = await FishType.findOne({id:it.child});
                    it.parent = await FishType.findOne({id:it.parent});

                    return it;
                }));

                //Para cargar los parents
                type.parentsTypes = await Promise.all(type.parentsTypes.map(async it=>{
                    it.child = await FishType.findOne({id:it.child});
                    it.parent = await FishType.findOne({id:it.parent});

                    return it;
                }));

                return type;
            }));

            res.json(featured);
        }   
        catch(e){
            console.error(e);
            res.serverError(e);
        }
    }

};

