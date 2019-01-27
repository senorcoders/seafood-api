
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
            let cart = await ShoppingCart.findOne({ buyer, status: "pending" }).populate("items");
            let currentAdminCharges = await require( './PricingChargesController' ).CurrentPricingCharges();
            if (cart !== undefined ) {                
                let totalShipping  = 0;
                let totalSFSMargin = 0;
                let totalCustoms   = 0;
                let totalUAETaxes  = 0;
                let totalOtherFees = 0;
                let subtotal       = 0;
                let total          = 0;

                //group items by seller
                shippingItems  = [];
                await Promise.all( cart.items.map( async item => {
                    let itemStore = await Fish.findOne( { id: item.fish } ).populate('store');
                    let fishCharges  = await require('./FishController').getItemChargesByWeight(item.fish, item.quantity.value, currentAdminCharges)
                    item.fish = itemStore;
                    item.store = itemStore.store.id;
                    item.country = itemStore.country;
                    item.city = itemStore.city;                    
                    item.fishCharges     = fishCharges;

                    //order items by store and putting them into shippingItems
                    let storeIsThere=false
                    let storeIndex = 0;
                    shippingItems.map( ( shippingItem, index ) => {
                        if( shippingItem.store == itemStore.store.id ){                        
                            storeIsThere = true;
                            storeIndex = index;
                        }
                    } )
                    if( !storeIsThere ){
                        shippingItems.push( { store: itemStore.store.id, items: [] } );
                        shippingItems[ shippingItems.length -1 ].items.push( item );
                    }else{
                        shippingItems[ storeIndex ].items.push( item );
                    }
                    
                } ) )


                await Promise.all( shippingItems.map( async store => {
                    let totalWeight = 0;
                    let country = '';
                    let city = '';
                    let firstMileFee = 0;
                    await Promise.all( store.items.map( async item => {
                        fishCharges  = await require('./FishController').getItemChargesByWeight(item.fish.id, item.quantity.value, currentAdminCharges)
                        firstMileFee = fishCharges.firstMileFee;
                        totalWeight += item.quantity.value;
                        country = item.country;                        
                        city = item.city;
                    } ) )
                    shippingRate = await require('./FishController').getShippingBySeller( firstMileFee, city, totalWeight ); 
                    store.totalWeight = totalWeight;
                    store.shipping = shippingRate; //{ firstMileFee, totalWeight: totalWeight, country: country, city: city };
                    
                    // now we calculate how much belongs to each product in the seller
                    store.items.map( item => {
                        item.shippingStore = item.quantity.value * store.shipping.shippingCost / store.totalWeight;
                        item.shipping = item.shippingStore;
                        item.fishCharges.shippingCost.cost = item.shippingStore;
                    } )
                } ) )
                
                //return res.status(200).json( shippingItems );
                
                //return res.json( shippingItems );
                let currentPricingCharges = currentAdminCharges;
                let today = new Date();
  
                await Promise.all(cart.items.map(async function (it) {
                    it.fish = await Fish.findOne({ id: it.fish.id }).populate("type").populate("store");
                    it.fishCharges  = await require('./FishController').getItemChargesByWeight(it.fish.id, it.quantity.value, currentPricingCharges)
                    
                    let fishCountry = await Countries.findOne( { code: it.fish.country } );
                    console.log( 'fishCountry', fishCountry );
		    min = new Date();
		    if ( fishCountry == undefined ) {
			it.adminNumberOfDaysForDelivery = 3;
 			min.setDate( today.getDate() + 3 );
		    }else {
                        it.adminNumberOfDaysForDelivery = fishCountry.eta;
		        min.setDate( today.getDate() + fishCountry.eta );
		    }
                    //min = new Date();
                    //min.setDate( today.getDate() + fishCountry.eta );
                    it.minDeliveryDate = min;
                    //console.log('fishCharges', FishCharges);
                    //it.fishCharges = FishCharges;
                    shippingRate = await require('./ShippingRatesController').getShippingRateByCities( it.fish.city, it.quantity.value ); 
                    it.owner = await User.findOne( { id: it.fish.store.owner } )
                    it.shippingCost = it.fishCharges.shippingCost.cost;
                    
                    //now we calculate the shipping for each seller so we replace the shipping calc
                    await Promise.all( shippingItems.map( async store => {
                        await Promise.all(store.items.map( async item => {
                            if( item.id == it.id ) {
                                it.fishCharges.finalPrice = it.fishCharges.finalPrice - it.fishCharges.shippingCost.cost + item.shippingStore ;
                                it.fishCharges.shippingCost.cost = item.shippingStore;
                                console.log( 'shipping', item.shippingStore);
                                it.shipping   =  item.shippingStore;
                            }
                            return item;
                        } ) );
                        return store;
                    } ) )

                    //console.log( 'fish charges error', it.fishCharges );
                    /*it.fishCharges.sfsMargin = 0;
                    it.fishCharges.sfsMarginCost = 0;
                    it.fishCharges.uaeTaxesFee = 0;
                    it.fishCharges.finalPrice = 0;*/

                    totalShipping  += it.fishCharges.shippingCost.cost ;
                    //console.log( 'now shipping', totalShipping);
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

                    

                    if(!it.fishCharges.sfsMarginCost || it.fishCharges.sfsMarginCost == "NaN"){
                        it.fishCharges.sfsMarginCost = 0;
                    }
                    if(!it.fishCharges.uaeTaxesFee || it.fishCharges.uaeTaxesFee == "NaN"){
                        it.fishCharges.uaeTaxes = 0;
                        it.fishCharges.uaeTaxesFee = 0;
                    }

                    if( !it.fishCharges.uaeTaxes || it.fishCharges.uaeTaxes == "NaN" ) {
                        it.fishCharges.uaeTaxes = 0;
                    }

                    
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
                console.log('total SHipping', totalShipping);
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
                    cart.totalUAETaxes = totalUAETaxes;
                    cart.totalShipping = totalShipping;
                    cart.shipping = totalShipping;


                }

                return res.json(cart)
            };
            console.log( 'start' );
      
            cart = await ShoppingCart.create(
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

    getOpenOrders: async( req, res ) => {
        try {
            let buyer = req.param("buyer");
            let orders = await ShoppingCart.find({ orderStatus: "5c017ad347fb07027943a403", buyer }).populate("items").populate('orderStatus').sort( 'createdAt DESC' );

            res.status( 200 ).json( orders );

        } catch (error) {
            console.error(e);
            res.serverError(e);
        }
    },

    getCartPaid: async (req, res) => {
        try {
            let buyer = req.param("buyer");
            let carts = await ShoppingCart.find({ status: "close", buyer }).populate("items").sort( "createdAt DESC" );

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
                itemCharges  = await require('./FishController').getItemChargesByWeight(it.fish, it.quantity.value);
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
                //await require("./../../mailer").sendCartPaidSellerNotified(fullName, cart, st, OrderNumber,st[0].fish.store.owner.email)
                await MailerService.sendCartPaidSellerNotified(fullName, cart, st, OrderNumber,st[0].fish.store.owner.email)
            }
            await MailerService.sendCartPaidBuyerNotified(itemsShopping, cart,OrderNumber,storeName);
            await MailerService.sendCartPaidAdminNotified(itemsShopping, cart,OrderNumber,storeName)
            // await require("./../../mailer").sendCartPaidBuyer(itemsShopping, cart,OrderNumber,storeName);
            //  await require("./../../mailer").sendCartPaidAdmin(itemsShopping, cart,OrderNumber,storeName);
            cart = await ShoppingCart.update({ id: req.param("id") }, { 
                status: "paid", 
                paidDateTime: paidDateTime ,
                orderNumber: OrderNumber,
                orderStatus: OrderStatus
                
            }).fetch();
            await ItemShopping.update( { shoppingCart: req.param("id") } ).set( { status: '5c017ae247fb07027943a404' } );
            res.json(cart);
        }
        catch (e) {
            console.error(e);
            res.serverError(e);
        }
    }

};

