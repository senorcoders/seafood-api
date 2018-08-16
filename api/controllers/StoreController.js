
module.exports = {
 save: async (req, res)=>{
    try{
        let imageCtrl = require("./ImageController");
        let owner = req.param("owner"), description = req.param("description"),
        location = req.param("location"), name = req.param("name");
        let store = await Store.create({owner, description, location, name}).fetch();;console.log(store);

        store = await imageCtrl.saveLogoStore(req, store.id);
        res.json(store);
    }
    catch(e){
        console.error(e);
        res.serverError(e);
    }
 },
 
 getXUser: async (req, res)=>{
    try{
        let id = req.param("id");
        let store = await Store.find().where({owner: id});
        if( store === undefined ){
            return res.status(400).send('not found');
        }

        res.json(store);
    }
    catch(e){
        console.error(e);
        res.serverError(e);
    }
 },

 getStoreSimplified: async (req, res)=>{
    try{
        let stores = await Store.find();
        stores = stores.map(function(it){
            return {id: it.id, name: it.name};
        });

        res.json(stores);
    }
    catch(e){
        console.error(e);
        res.serverError(e);
    }
 },

 getWithTypes: async (req, res)=>{
    try{
        let id = req.param("id");
        let store = await Store.findOne({id});
        store.fishs =  await Fish.find({store:store.id}).populate("type")

        res.json(store);
    }
    catch(e){
        console.error(e);
        res.serverError(e);
    }
 }

};

