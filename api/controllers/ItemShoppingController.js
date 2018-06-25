

module.exports = {
  
    getItemsXCart: async function (req, res) {
        try{
            let items = await ItemShopping.find({shoppingCart: req.param("id") });
            items = await Promise.all(items.map(async function(it){
                console.log(it);
                try{
                    it.fish = await Fish.findOne({ id: it.fish });
                    it.fish.store = await Store.findOne({ id: it.fish.store });
                }
                catch(e){
                    console.error(e);
                }

                return it;
            }));

            res.json(items);
        }
        catch(e){
            console.error(e);
            res.serverError(e);
        }
    }
};

