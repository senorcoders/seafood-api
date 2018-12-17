
module.exports = {

    testOrder: async ( req, res ) => {
        try {
            let lastOrder = await ShoppingCart.find().sort('orderNumber DESC').limit(1);//.max('orderNumber');
            let max = 0;
            console.log( lastOrder );
            if(lastOrder.length > 0){
                if( lastOrder[0].hasOwnProperty("orderNumber") ) {
                    max = lastOrder[0].orderNumber + 1;
                }                                            
            }

            res.status( 200 ).json( max );
        } catch (error) {
            res.serverError( error );
        }
    },

    createCart: async function (req, res) {
        try {
            let buyer = req.param("buyer");
            let carts = await ShoppingCart.find({ buyer, status: "pending" });
            if (carts !== undefined &&
                Object.prototype.toString.call(carts) === '[object Array]' &&
                carts.length > 0
            ) {
                let cart = await ShoppingCart.findOne({ id: carts[0].id }).populate("items");
                let totalShipping  = 0;
                let totalSFSMargin = 0;
                let totalCustoms   = 0;
                let totalUAETaxes  = 0;
                let totalOtherFees = 0;
                let subtotal       = 0;
                let total          = 0;

                let currentPricingCharges = await require('./PricingChargesController').CurrentPricingCharges();
                cart.items = await Promise.all(cart.items.map(async function (it) {
                    it.fish = await Fish.findOne({ id: it.fish }).populate("type").populate("store");
                    console.log( 'it fish', it.fish.id );
                    console.log( 'it qty', it.quantity.value );
                    it.fishCharges  = await require('./FishController').getItemChargesByWeight(it.fish.id, it.quantity.value)
                    //console.log('fishCharges', FishCharges);
                    //it.fishCharges = FishCharges;
                    shippingRate = await require('./ShippingRatesController').getShippingRateByCities( it.fish.city, it.quantity.value ); 
                    it.owner = await User.findOne( { id: it.fish.store.owner } )
                    it.shippingCost = it.fishCharges.shippingCost.cost;

                    totalShipping  += it.fishCharges.shippingCost.cost;
                    totalSFSMargin += it.fishCharges.sfsMarginCost;
                    totalCustoms   += it.fishCharges.customsFee;
                    totalUAETaxes  += it.fishCharges.uaeTaxesFee;
                    
                    subtotal       += it.fishCharges.fishCost;
                    total          += it.fishCharges.finalPrice;

                    it.currentCharges = {
                        sfsMargin   : it.fishCharges.sfsMargin,
                        shipping    : it.fishCharges.shipping,
                        customs     : it.fishCharges.customs                        
                    };
                    it.shipping     = it.fishCharges.shippingCost.cost;
                    it.sfsMargin    = it.fishCharges.sfsMarginCost;
                    it.customs      = it.fishCharges.customsFee; 
                    it.uaeTaxes     = it.fishCharges.uaeTaxesFee;        
                    


                    await ItemShopping.update({ id: it.id }, {
                        currentCharges: it.currentCharges,
                        shipping:  it.shipping,
                        sfsMargin: it.sfsMargin,
                        customs:   it.customs,
                        uaeTaxes:  it.uaeTaxes
                    })

                    return it;
                }));                
                
                totalOtherFees = totalSFSMargin + totalCustoms;                             
                totalOtherFees = Number(parseFloat(totalOtherFees).toFixed(2));
                totalShipping = Number(parseFloat(totalShipping).toFixed(2));
                totalUAETaxes = Number(parseFloat(totalUAETaxes).toFixed(2));
                total = Number(parseFloat(total).toFixed(2));
                if (total !== cart.total) { 
                    await ShoppingCart.update({ id: cart.id }, { 
                        currentCharges: currentPricingCharges,
                        subTotal: subtotal,
                        shipping: totalShipping,
                        sfsMargin: totalSFSMargin,
                        customs: totalCustoms,
                        total: total,
                        totalOtherFees: totalOtherFees,
                        uaeTaxes: totalUAETaxes,
                    });
                    cart.total = total;
                    cart.customs = totalCustoms;
                    cart.totalOtherFees = totalOtherFees;
                    cart.totalUAETaxes = totalUAETaxes


                }

                return res.json(cart)
            };
            console.log( 'start' );
            
            
            console.log( currentPricingCharges );
      
            let cart = await ShoppingCart.create(
                { 
                    buyer: buyer                                        
                }
                ).fetch();

            res.status(200).json(cart);
        }
        catch (e) {
            console.error(e);
            res.serverError(e);
        }
    },

    getCartPaid: async (req, res) => {
        try {
            let buyer = req.param("buyer");
            let carts = await ShoppingCart.find({ status: "paid", buyer }).populate("items");

            //Para calcular el total de los carritos
            let calcTotal = async (cart) => {
                cart.items = await Promise.all(cart.items.map(async function (it) {
                    it.fish = await Fish.findOne({ id: it.fish }).populate("type").populate("store");
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

                return cart;
            }

            let cartFinish = [];
            for (let cart of carts) {
                let c = await calcTotal(cart);
                cartFinish.push(c);
            }

            cartFinish = cartFinish.sort((a, b) => {
                // Turn your strings into dates, and then subtract them
                // to get a value that is either negative, positive, or zero.
                return new Date(b.createdAt) - new Date(a.createdAt);
            }).map((a)=>{
                a.createdAt = new Date(a.createdAt);
                return a;
            });


            res.status(200).json(cartFinish);
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
            // check if this item is already in this cart
            let alredyInCart = await ItemShopping.find({
                shoppingCart: id,
                fish: item.fish
            });
            let itemShopping ;
            if( alredyInCart !== undefined && alredyInCart[0] !== undefined ){		
                let item_id = alredyInCart[0].id;
                item.quantity.value += alredyInCart[0].quantity.value;
                itemShopping = await ItemShopping.update( { id: item_id }, item );
                //return res.status(200).send( item );
            }else{
                itemShopping = await ItemShopping.create(item);    
            }

            //let itemShopping = await ItemShopping.create(item);

            //Para calcular el total del carrito
            let cart = await ShoppingCart.findOne({ id }).populate("items");

            let total = 0;
            for (var it of cart.items) {
                //total += Number(it.price.value * it.quantity.value);
                itemCharges  = await require('./FishController').getItemChargesByWeight(it.fish.id, it.quantity.value);
                total += itemCharges['finalPrice'];
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

    updateShoppingCartPaid: async function (req, res) {
        try {
            let paidDateTime=new Date().toISOString();
            let lastOrder = await ShoppingCart.find().sort('orderNumber DESC').limit(1);//.max('orderNumber');
            let max = 0;
            if(lastOrder.length > 0)
                if( lastOrder[0].hasOwnProperty("orderNumber") ) 
                    max = lastOrder[0].orderNumber + 1;

            let cart = await ShoppingCart.findOne({ id: req.param("id"), status: "pending" }).populate("buyer");
            if (cart === undefined) {
                return res.status(400).send("not found");
            }

            let itemsShopping = await ItemShopping.find({ shoppingCart: cart.id }).populate("fish");
            itemsShopping = await Promise.all(itemsShopping.map(async function (it) {
                it.fish.store = await Store.findOne({ id: it.fish.store }).populate("owner");

                return it;
            }));

            

            //Se le envia los datos de compras al vendedor
            //await require("./../../mailer").sendCartPaidBuyer(itemsShopping, cart.buyer.email);
            let updateStatusItem = await ItemShopping.update( { shoppingCart: cart.id  }, { status: '5c017ae247fb07027943a404' } )
            //Ahora agrupamos los compras por store para avisar a sus dueños de las ventas
            let itemsStore = [];
            for (let item of itemsShopping) {
                
                let index = itemsStore.findIndex(function (it) {
                    return it[0].fish.store.id === item.fish.store.id;
                });

                if (index === -1) {
                    itemsStore.push([item]);
                } else {
                    itemsStore[index].push(item);
                }
            }
            let storeName=[];
            let OrderNumber     = max;
            let OrderStatus     = "5c017ad347fb07027943a403"; //Pending Seller Confirmation
            //Se envia los correos a los dueños de las tiendas
            for (let st of itemsStore) {
                storeName.push(st[0].fish.store.name);
                // shippingRate.push(await require('./ShippingRatesController').getShippingRateByCities( st[0].fish.city, st[0].quantity.value ));
                let fullName = st[0].fish.store.owner.firstName + " " + st[0].fish.store.owner.lastName;
                let fullNameBuyer = cart.buyer.firstName + " " + cart.buyer.lastName
                await require("./../../mailer").sendCartPaidSellerNotified(fullName, cart, st, OrderNumber,st[0].fish.store.owner.email)
            }
            await require("./../../mailer").sendCartPaidBuyer(itemsShopping, cart,OrderNumber,storeName);
             await require("./../../mailer").sendCartPaidAdmin(itemsShopping, cart,OrderNumber,storeName);
            cart = await ShoppingCart.update({ id: req.param("id") }, { 
                status: "paid", 
                paidDateTime: paidDateTime ,
                orderNumber: OrderNumber,
                orderStatus: OrderStatus
                
            }).fetch();
            res.json(cart);
        }
        catch (e) {
            console.error(e);
            res.serverError(e);
        }
    }

};

