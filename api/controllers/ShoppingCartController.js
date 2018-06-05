
module.exports = {
  addItem: async (req, res)=>{
    try{
        let id = req.param("id"), idFish = req.param("idFish");
        await ShoppingCart.addToCollection(id, 'fishs', idFish);
        let cart = await ShoppingCart.findOne({ id }).populate("fishs");
        res.json(cart);
    }
    catch(e){
        console.error(e);
        res.serverError(e);
    }
  }

};

