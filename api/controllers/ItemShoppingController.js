const favoriteFsihCtrl = require("./FavoriteFishController");

module.exports = {
    getWithAllData: async function(req, res){
        try{
            let item = await ItemShopping.findOne({id: req.param("id")}).populate("fish").populate("shoppingCart").populate( 'status' );
            item.shoppingCart = await ShoppingCart.findOne({id: item.shoppingCart.id}).populate("buyer").populate( 'orderStatus' );

            res.json(item);
        }
        catch(e){
            console.error(e);
            res.serverError(e);
        }
    },

    getItemsXCart: async function (req, res) {
        try{
            let items = await ItemShopping.find({shoppingCart: req.param("id") }).populate('status');
            items = await Promise.all(items.map(async function(it){
                //console.log(it);
                try{
                    it.fish = await Fish.findOne({ id: it.fish });
                    it.fish.store = await Store.findOne({ id: it.fish.store });
                    // it.ItemStatus = await OrderStatus.findOne( { id: it.status } );
                    it.fish.storeOwner = await User.findOne( { id: it.fish.store.owner } );                
                    it.favorite = await new Promise((resolve, reject)=>{
                        let ress = {
                            json: resolve,
                            serverError: reject
                        };
                        reqq = {
                            param: function(id){
                                let params = {
                                    user: req.param("user"),
                                    fish: it.fish.id
                                };

                                return params[id];
                            }
                        }
                        favoriteFsihCtrl.getXUserAndFish(reqq, ress);
                    });
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
                let items = await ItemShopping.find({fish: f.id}).populate("fish").populate("shoppingCart").populate("status").sort('updatedAt DESC');
                itemsShoppings = itemsShoppings.concat(items);
            }

            //filtrmos los items que ya esten pagados
            itemsShoppings = itemsShoppings.filter(function(it){
                if( it.shoppingCart === null || it.shoppingCart.status === null ) return false;
                return it.shoppingCart.status == "paid" && it.shippingStatus === "pending";
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
    },

    getItemsXStoreAndItemPaid: async function(req, res){
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
                if( it.shoppingCart === null || it.shoppingCart.status === null ) return false;
                return it.shoppingCart.status === "paid" && it.shippingStatus === "shipped";
            });

            //Agregamos los datos del comprador
            itemsShoppings = await Promise.all(itemsShoppings.map(async function(it){
                it.shoppingCart = await ShoppingCart.findOne({ id: it.shoppingCart.id}).populate("buyer");
                return it;
            }));

            itemsShoppings = itemsShoppings.sort((a, b)=>{
                // Turn your strings into dates, and then subtract them
                // to get a value that is either negative, positive, or zero.
                return new Date(b.createdAt) - new Date(a.createdAt);
              });

              itemsShoppings = itemsShoppings.map((a)=>{
                  a.createdAt = new Date(a.createdAt);
                  return a;
              });

            res.json(itemsShoppings);
        }
        catch(e){
            console.error(e);
            res.serverError(e);
        }
    },

    updateStatusToShipped: async function(req, res){
        try{

            let  id = req.param("id");
            let item = await ItemShopping.findOne({id}).populate("shoppingCart").populate("fish");
            if( item === undefined ){
                res.status(400).send("not found");
            }

            let cart = await ShoppingCart.findOne({id: item.shoppingCart.id}).populate("buyer")

            await ItemShopping.update({id}, {shippingStatus:"shipped", status: '5c017b0e47fb07027943a406'})

            await require("./../../mailer").sendEmailItemRoad(cart.buyer.email, item.trackingID, item.trackingFile, item);

            res.json({msg: "success"});
        }
        catch(e){
            console.error(e);
            res.serverError(e);
        }
    },

    updateItemStatus: async ( req, res ) => {
        try {
            let id = req.param("id");
            let status = req.param("status");
            var ts = Math.round((new Date()).getTime() / 1000);

            let item = await ItemShopping.findOne({id}).populate("shoppingCart").populate("fish");
            if( item === undefined ){
                res.status(400).send("not found");
            }
            let store=await Store.findOne({id:item.fish.store}).populate("owner")
            let cart = await ShoppingCart.findOne({id: item.shoppingCart.id}).populate("buyer")
            let name=cart.buyer.firstName+' '+cart.buyer.lastName;
            if( status == '5c017af047fb07027943a405' ){//pending seller fulfillment
                await ItemShopping.update({id}, { status: '5c017af047fb07027943a405'})
            }else if( status == '5c017b0e47fb07027943a406' ){ //admin marks the item as shipped
                let data=await ItemShopping.update({id}, 
                    { 
                        shippingStatus:"shipped", 
                        status: '5c017b0e47fb07027943a406',
                        shippedAt: ts
                    }
                ).fetch();
                if(data.length > 0){
                    await require("./../../mailer").sendEmailItemRoad(name,cart,store,item);
                }
            }else if( status == '5c017b1447fb07027943a407' ) {//admin marks the item as arrived
                let data=await ItemShopping.update({id}, { 
                    status: '5c017b1447fb07027943a407',
                    arrivedAt: ts
                }).fetch()
                if(data.length > 0){
                    //send email to buyer 
                    await require("./../../mailer").sendEmailOrderArrived(name,cart,store,item);
                }
            }else if( status == '5c017b2147fb07027943a408' ){ //out for delivery
                await ItemShopping.update({id}, { status: '5c017b2147fb07027943a408', outForDeliveryAt: ts })
            }else if( status == '5c017b3c47fb07027943a409' ){ //Delivered
                let data=await ItemShopping.update({id}, { status: '5c017b3c47fb07027943a409', deliveredAt: ts}).fetch()
                if(data.length > 0){
                    //send email to buyer 
                    await require("./../../mailer").sendEmailOrderDelivered(name,cart,store,item);
                    //send email to seller
                    await require("./../../mailer").sendEmailOrderDeliveredSeller(cart,store,item);
                }
            }else if( status == '5c017b4547fb07027943a40a' ){ //Pending Repayment
                await ItemShopping.update({id}, { status: '5c017b4547fb07027943a40a'})
            }else if( status == '5c017b4f47fb07027943a40b' ){ //Seller Repaid
                let repayedRef = req.param("ref");
                await ItemShopping.update({id}, { status: '5c017b4f47fb07027943a40b', repayedAt: ts, repayedRef: repayedRef})
            }else if( status == '5c017b5a47fb07027943a40c' ){ //Client Cancelled Order"
                let data=await ItemShopping.update({id}, { status: '5c017b5a47fb07027943a40c', cancelAt:ts}).fetch();
                if(data.length > 0){
                    //send email to buyer
                    await require("./../../mailer").sendEmailOrderStatus(name,cart,store,item);
                    //send email to seller
                     await require("./../../mailer").sendEmailOrderStatusSeller(name,cart,store,item);
                    //send email to admin
                    await require("./../../mailer").sendEmailOrderStatusAdmin(name,cart,store,item);
                }
            }else if( status == '5c017b7047fb07027943a40e' ){ //Refunded
                await ItemShopping.update({id}, { status: '5c017b7047fb07027943a40e'})
            }else if( status == '5c06f4bf7650a503f4b731fd' ){ //Seller Cancelled Order
                let data=await ItemShopping.update({id}, { status: '5c06f4bf7650a503f4b731fd', cancelAt: ts}).fetch();
                if(data.length > 0){
                    //send email to buyer
                    await require("./../../mailer").orderCancelledBySellerBuyerNotified(name,cart,store,item);
                    //send email to admin
                    await require("./../../mailer").orderCancelledBySellerAdminNotified(name,cart,store,item);
                }
            }else if ( status == '5c13f453d827ce28632af048'){//pending fulfillment
                let data=await ItemShopping.update({id}, { status: '5c13f453d827ce28632af048', cancelAt: ts}).fetch();                
            }else{
                res.status(400).send("status not found")
            }
            res.status(200).json( { "message": "status updated" } );




        } catch (e) {
            console.error(e);
            res.serverError(e);
        }
    },

    getItemsByStatus: async ( req, res ) => {
        try {                                    
            let status_id = req.param("status");
            let items = await ItemShopping.find({ status: status_id }).populate("fish").populate("shoppingCart").populate("status").sort('updatedAt DESC');
            
            items = await Promise.all(items.map(async function(it){
                it.store = await Store.findOne({ id: it.fish.store});
                fishCountry = await Countries.findOne( { code: it.fish.country } );
                
                it.country = {
                    code: fishCountry.code,  
                    name: fishCountry.name
                }

                Promise.all(fishCountry.cities.map(async function(city){ 
                    if( city.code === it.fish.city ){
                        it.city = city;
                    }
                    return city;
                } ) );

                return it;
            }));

            

            res.status(200).json( items );
            
        } catch (e) {
            console.error(e);
            res.serverError(e);
        }
    },
    getPayedItems: async ( req, res ) => {
        try {                                    
            //let status_id = req.param("status");
            let items = await ItemShopping.find(
                { 
                    where: {
                        status: '5c017b3c47fb07027943a409'
                    } 
                }
            ).populate("fish").populate("shoppingCart").populate("status").sort('updatedAt DESC');
            
            items = await Promise.all(items.map(async function(it){
                it.store = await Store.findOne({ id: it.fish.store});
                if(it.fish.country){
                    fishCountry = await Countries.findOne( { code: it.fish.country } );
                    it.country = {
                        code: fishCountry.code,  
                        name: fishCountry.name
                    }

                    Promise.all(fishCountry.cities.map(async function(city){ 
                        if( city.code === it.fish.city ){
                            it.city = city;
                        }
                        return city;
                    } ) );    
                }
                

                return it;
            }));

            

            res.status(200).json( items );
            
        } catch (e) {
            console.error(e);
            res.serverError(e);
        }
    },
    getCancelledItems: async ( req, res ) => {
        try {                                    
            //let status_id = req.param("status");
            let items = await ItemShopping.find(
                { 
                    where: {
                        status: ['5c017b5a47fb07027943a40c','5c06f4bf7650a503f4b731fd']
                    } 
                }
            ).populate("fish").populate("shoppingCart").populate("status").sort('updatedAt DESC');
            
            items = await Promise.all(items.map(async function(it){
                it.store = await Store.findOne({ id: it.fish.store});
                if(it.fish.country){
                    fishCountry = await Countries.findOne( { code: it.fish.country } );
                    it.country = {
                        code: fishCountry.code,  
                        name: fishCountry.name
                    }

                    Promise.all(fishCountry.cities.map(async function(city){ 
                        if( city.code === it.fish.city ){
                            it.city = city;
                        }
                        return city;
                    } ) );    
                }
                

                return it;
            }));

            

            res.status(200).json( items );
            
        } catch (e) {
            console.error(e);
            res.serverError(e);
        }
    },
    getPayedItemsByOrderNumber: async ( req, res ) => {
        let orderNumber=req.param('orderNumber')
        try {  
            let shoppingCart=await ShoppingCart.find({'orderNumber':orderNumber}); 
            let items=[];
            for(let sc of shoppingCart){
                items= await ItemShopping.find(
                { 
                    where: {
                        shoppingCart:sc.id,
                        status: [ '5c017af047fb07027943a405', '5c017b0e47fb07027943a406', '5c017b1447fb07027943a407', '5c017b2147fb07027943a408', '5c017b3c47fb07027943a409', '5c017b4547fb07027943a40a' ],

                    } 
                }
                ).populate("fish").populate("shoppingCart").populate("status").sort('updatedAt DESC');
            }      
            await Promise.all(items.map(async function(it){
                it.store = await Store.findOne({ id: it.fish.store});
                if(it.fish.country){
                    fishCountry = await Countries.findOne( { code: it.fish.country } );
                    it.country = {
                        code: fishCountry.code,  
                        name: fishCountry.name
                    }

                    Promise.all(fishCountry.cities.map(async function(city){ 
                        if( city.code === it.fish.city ){
                            it.city = city;
                        }
                        return city;
                    } ) );    
                }
                return it;
            }));                        
            res.status(200).json( items );
            
        } catch (e) {
            console.error(e);
            res.serverError(e);
        }
    },
};

