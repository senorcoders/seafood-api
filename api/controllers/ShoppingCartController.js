
module.exports = {

    createCart: async function (req, res) {
        try {
            let buyer = req.param("buyer");
            let carts = await ShoppingCart.find({ buyer, status: "pending" });
            if (carts !== undefined &&
                Object.prototype.toString.call(carts) === '[object Array]' &&
                carts.length > 0
            ) {
                let cart = await ShoppingCart.findOne({ id: carts[0].id }).populate("items");
                cart.items = await Promise.all(cart.items.map(async function (it) {
                    it.fish = await Fish.findOne({ id: it.fish }).populate("type");
                    return it;
                }));

                let total = 0;
                for (var it of cart.items) {
                    total += Number(it.price.value * it.quantity.value);
                }

                total = Number(parseFloat(total).toFixed(2));
                if (total !== cart.total) {
                    await ShoppingCart.update({ id: cart.id }, { total: total });
                    cart.total = total;
                }

                return res.json(cart)
            }

            let cart = await ShoppingCart.create({ buyer }).fetch();

            res.json(cart);
        }
        catch (e) {
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
                    price: req.param("price"),
                    shippingStatus: req.param("shippingStatus")
                };

            let itemShopping = await ItemShopping.create(item);

            //Para calcular el total del carrito
            let cart = await ShoppingCart.findOne({ id }).populate("items");

            let total = 0;
            for (var it of cart.items) {
                total += Number(it.price.value * it.quantity.value);
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

    updateItems: async (req, res) => {
        try {

            let items = req.param("items");
            if (Object.prototype.toString.call(items) !== "[object Array]") {
                return res.status(500).send("invalid parameter items");
            }

            for (let it of items) {
                let id = it.id;
                delete it.id;
                await ItemShopping.update({ id }, it);
            }

            res.json({ msg: "success" });

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

            let total = 0;
            for (var it of cart.items) {
                total += Number(it.price.value * it.quantity.value);
            }

            total = Number(parseFloat(total).toFixed(2));
            if (total !== cart.total) {
                await ShoppingCart.update({ id: cart.id }, { total: total });
                cart.total = total;
            }

            res.json(cart);
        }
        catch (e) {
            console.error(e);
            res.serverError(e);
        }
    },

    updateShoppingCartPaid: async function(req, res){
        try{

            let cart = await ShoppingCart.findOne({id: req.param("id"), status: "pending" }).populate("buyer");
            if( cart === undefined ){
                return res.status(400).send("not found");
            }

            let itemsShopping = await ItemShopping.find({shoppingCart: cart.id}).populate("fish");
            itemsShopping = await Promise.all(itemsShopping.map(async function(it){
                it.fish.store = await Store.findOne({id: it.fish.store }).populate("owner");

                return it;
            }));

            //Se le envia los datos de compras al vendedor
            await require("./../../mailer").sendCartPaidBuyer(cart.buyer.firstName+ " "+ cart.buyer.lastName, 
            itemsShopping, cart.buyer.email);

            //Ahora agrupamos los compras por store para avisar a sus dueños de las ventas
            let itemsStore = [];
            for(let item of itemsShopping){

                let index = itemsStore.findIndex(function(it){
                    return it[0].fish.store.id === item.fish.store.id;
                });

                if( index === -1 ){
                    itemsStore.push( [item] );
                }else{
                    itemsStore[index].push(item);
                }
            }

            //Se envia los correos a los dueños de las tiendas
            for(let st of itemsStore){
                let fullName = st[0].fish.store.owner.firstName+ " "+ st[0].fish.store.owner.lastName;
                let fullNameBuyer = cart.buyer.firstName+ " "+ cart.buyer.lastName
                await require("./../../mailer").sendCartSeller(fullName, fullNameBuyer, cart.buyer.email, st, st[0].fish.store.owner.email)
            }

            cart = await ShoppingCart.update({id: req.param("id") }, {status: "paid", paidDateTime: req.param("paidDateTime") }).fetch();

            res.json(cart);
        }
        catch(e){
            console.error(e);
            res.serverError(e);
        }
    }

};

