

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
    },

    getItemsXStorePaid: async function(req, res){
        try{
            let id = req.param("id");
            let store = await Store.findOne({id});
            if( store === undefined ){
                return res.status(400).send("not found");
            }

            //cargamos los fish de la tienda
            let fishs = await Fish.find({store: store.id});

            //cargamos los items shopping con los datos de cart
            let itemsShoppings = [];
            for(let f of fishs){
                let items = await ItemShopping.find({fish: f.id}).populate("fish").populate("shoppingCart");
                itemsShoppings = itemsShoppings.concat(items);
            }

            //filtrmos los items que ya esten pagados
            itemsShoppings = itemsShoppings.filter(function(it){
                return it.shoppingCart.status == "paid";
            });

            //Agregamos los datos del comprador
            itemsShoppings = await Promise.all(itemsShoppings.map(async function(it){
                it.shoppingCart = await ShoppingCart.findOne({ id: it.shoppingCart.id}).populate("buyer");
                return it;
            }));

            res.json(itemsShoppings);
        }
        catch(e){
            console.error(e);
            res.serverError(e);
        }
    }
};

