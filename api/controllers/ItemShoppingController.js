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
            let items = await ItemShopping.find({shoppingCart: req.param("id") });
            items = await Promise.all(items.map(async function(it){
                console.log(it);
                try{
                    it.fish = await Fish.findOne({ id: it.fish });
                    it.fish.store = await Store.findOne({ id: it.fish.store });
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

            let item = await ItemShopping.findOne({id}).populate("shoppingCart").populate("fish");
            if( item === undefined ){
                res.status(400).send("not found");
            }
            let store=await Store.findOne({id:item.fish.store}).populate("owner")
            let cart = await ShoppingCart.findOne({id: item.shoppingCart.id}).populate("buyer")
            let name=cart.buyer.firstName+' '+cart.buyer.lastName;
            if( status == '5c017b0e47fb07027943a406' ){ //admin marks the item as shipped
                await ItemShopping.update({id}, {shippingStatus:"shipped", status: '5c017b0e47fb07027943a406'})
                await require("./../../mailer").sendEmailItemRoad(cart.buyer.email, item.trackingID, item.trackingFile, item);
            }else if( status == '5c017b1447fb07027943a407' ) {//admin marks the item as arrived
                await ItemShopping.update({id}, { status: '5c017b1447fb07027943a407'})
            }else if( status == '5c017b2147fb07027943a408' ){ //out for delivery
                await ItemShopping.update({id}, { status: '5c017b2147fb07027943a408'})
            }else if( status == '5c017b3c47fb07027943a409' ){ //Delivered
                await ItemShopping.update({id}, { status: '5c017b3c47fb07027943a409'})
            }else if( status == '5c017b4547fb07027943a40a' ){ //Pending Repayment
                await ItemShopping.update({id}, { status: '5c017b4547fb07027943a40a'})
            }else if( status == '5c017b4f47fb07027943a40b' ){ //Seller Repaid
                await ItemShopping.update({id}, { status: '5c017b4f47fb07027943a40b'})
            }else if( status == '5c017b5a47fb07027943a40c' ){ //Client Cancelled Order"
                let item=await ItemShopping.update({id}, { status: '5c017b5a47fb07027943a40c'}).fetch();
                if(item.length > 0){
                    //send email to buyer
                    await require("./../../mailer").sendEmailOrderStatus(name,cart,store);
                    //send email to seller
                    await require("./../../mailer").sendEmailOrderStatusSeller(name,cart,store);
                    //send email to admin
                }
            }else if( status == '5c017b7047fb07027943a40e' ){ //Refunded
                await ItemShopping.update({id}, { status: '5c017b7047fb07027943a40e'})
            }else if( status == '5c06f4bf7650a503f4b731fd' ){ //Seller Cancelled Order
                await ItemShopping.update({id}, { status: '5c06f4bf7650a503f4b731fd'})
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
                return it;
            }));

            

            res.status(200).json( items );
            
        } catch (e) {
            console.error(e);
            res.serverError(e);
        }
    }
};

