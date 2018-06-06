
module.exports = {
 save: async (req, res)=>{
    try{
        let imageCtrl = require("./ImageController");
        let owner = req.param("owner"), description = req.param("description");
        let store = await Store.create({owner, description}).fetch();;console.log(store);

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
 }

};

