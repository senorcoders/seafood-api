
module.exports = {

    createCart: async function(req, res){
        try{
            let buyer = req.param("buyer");
            let carts = await ShoppingCart.find({ buyer, status: "pending" });
            if( carts !== undefined && 
                Object.prototype.toString.call(carts) === '[object Array]' &&
                carts.length > 0
            ){
                let cart = await ShoppingCart.findOne({id: carts[0].id }).populate("items");
                cart.items = await Promise.all(cart.items.map(async function (it) {
                    it.fish = await Fish.findOne({ id: it.fish }).populate("type");
                    return it;
                }));
                return res.json(cart)
            }

            let cart = await ShoppingCart.create({ buyer }).fetch();

            res.json(cart);
        }
        catch(e){
            console.error(e);
            res.serverError(e);
        }
    },

    addItem: async (req, res) => {
        try {
            let id = req.param("id"),
                item = {
                    shoppingCart: id,
                    fish: req.param("fish"),
                    quantity: req.param("quantity"),
                    price: req.param("price")
                };

            let itemShopping = await ItemShopping.create(item);

            //Para calcular el total del carrito
            let cart = await ShoppingCart.findOne({ id }).populate("items");
            
            let total=0;
            for (var it of cart.items) {
                total += Number(it.price.value*it.quantity.value);
            }

            total = Number(parseFloat(total).toFixed(2));

            await ShoppingCart.update({ id: cart.id }, { total: total });

            cart.total = total;
            cart.items = await Promise.all(cart.items.map(async (i) => {
                i.fish = await Fish.findOne({ id: i.fish });
                return i;
            }));

            res.json(cart);
        }
        catch (e) {
            console.error(e);
            res.serverError(e);
        }
    },

    getPopulateXID: async function (req, res) {
        try {

            let id = req.param("id");
            let cart = await ShoppingCart.findOne().where({ id }).populate("items");
            if (cart === undefined) {
                return res.status(400).send('not found');
            }

            cart.items = await Promise.all(cart.items.map(async function (it) {
                it.fish = await Fish.findOne({ id: it.fish }).populate("type");
                return it;
            }));

            res.json(cart);
        }
        catch (e) {
            console.error(e);
            res.serverError(e);
        }
    }

};

