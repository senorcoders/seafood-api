
module.exports = {
 save: async (req, res)=>{
    try{
        let imageCtrl = require("./ImageController");
        let owner = req.param("owner"), description = req.param("description");
        let store = await Store.create({owner, description}).fetch();;console.log(store);

        await imageCtrl.saveLogoStore(req, store.id);
        res.json(store);
    }
    catch(e){
        console.error(e);
        res.serverError(e);
    }
 } 

};

