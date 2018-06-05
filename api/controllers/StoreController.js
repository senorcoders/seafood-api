
module.exports = {
 save: async (req, res)=>{
    try{
        let imageCtrl = require("./ImageController");
        let owner = req.param("owner"), description = req.param("description");
        let store = await Store.create({owner, description});

        await imageCtrl.saveLogoStore(req, store.id);
        await imageCtrl.saveHeroStore(req, store.id);
        store = await imageCtrl.saveImagesStore(req, store.id);
        res.json(store);
    }
    catch(e){
        console.error(e);
        res.serverError(e);
    }
 } 

};

